export const meta = {
  name: 'audit-route-auth',
  description: 'Audit src/routes for missing authentication; adversarially verify each finding before reporting',
  phases: [
    { title: 'Audit', detail: 'one agent per route file finds unauthenticated endpoints' },
    { title: 'Verify', detail: 'an adversarial skeptic tries to refute each finding' },
  ],
}

const ROUTE_DIR = '/Users/leonan/Movies/Claude Code/repo-cc/demo-workflow/src/routes'
const AUTH_FILE = '/Users/leonan/Movies/Claude Code/repo-cc/demo-workflow/src/middleware/auth.ts'
const APP_FILE = '/Users/leonan/Movies/Claude Code/repo-cc/demo-workflow/src/app.ts'

const ROUTE_FILES = [
  'products.routes.ts',
  'users.routes.ts',
  'profile.routes.ts',
  'admin.routes.ts',
  'health.routes.ts',
  'payments.routes.ts',
  'webhooks.routes.ts',
  'orders.routes.ts',
]

const CONTEXT = `Projeto: API Express em TypeScript.
Convenção de autenticação: o middleware \`requireAuth\` exportado de ${AUTH_FILE}.
Um endpoint está AUTENTICADO se, e somente se, \`requireAuth\` é executado antes do handler — seja aplicado no router inteiro (router.use(requireAuth)), no app (não é o caso aqui: veja ${APP_FILE}, que NÃO aplica auth global), ou passado como middleware na própria rota (ex: router.get('/x', requireAuth, handler)).
Um endpoint SEM \`requireAuth\` na sua cadeia está sem autenticação.
Considere que alguns endpoints legitimamente NÃO precisam de auth (ex: health checks públicos, webhooks que usam validação de assinatura própria). Ainda assim, reporte-os, mas indique no campo "rationale" se a falta de auth parece intencional/aceitável ou perigosa.`

const AUDIT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['file', 'findings'],
  properties: {
    file: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['method', 'path', 'line', 'evidence', 'severity', 'rationale'],
        properties: {
          method: { type: 'string', description: 'HTTP method, e.g. GET/POST/DELETE' },
          path: { type: 'string', description: 'route path e.g. /orders/:id' },
          line: { type: 'integer', description: '1-indexed line of the route definition' },
          evidence: { type: 'string', description: 'exact code of the route definition and why requireAuth is absent from its chain' },
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
          rationale: { type: 'string', description: 'why this endpoint needs auth (or why the gap may be acceptable, e.g. health/webhook)' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['method', 'path', 'file', 'line', 'isReal', 'confidence', 'reasoning', 'severity'],
  properties: {
    method: { type: 'string' },
    path: { type: 'string' },
    file: { type: 'string' },
    line: { type: 'integer' },
    isReal: { type: 'boolean', description: 'true only if requireAuth is genuinely absent from the endpoint chain and auth is warranted' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    reasoning: { type: 'string', description: 'how the claim was tested — what would refute it, and whether it held' },
    severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'not-a-vuln'] },
  },
}

phase('Audit')

const audits = await pipeline(
  ROUTE_FILES,
  (fileName) =>
    agent(
      `${CONTEXT}

Sua tarefa: audite EXCLUSIVAMENTE o arquivo ${ROUTE_DIR}/${fileName}.
Leia o arquivo inteiro. Leia também ${AUTH_FILE} e ${APP_FILE} para entender a cadeia de middleware.
Para CADA rota definida (router.get/post/put/patch/delete/use), determine se \`requireAuth\` está presente na sua cadeia de execução.
Liste como finding TODA rota que executa seu handler SEM passar por \`requireAuth\`.
NÃO invente rotas; use apenas o que está no arquivo. Cite a linha exata e o trecho de código como evidência.
Retorne o objeto estruturado. Se não houver rotas sem auth, retorne findings: [].`,
      { label: `audit:${fileName}`, phase: 'Audit', schema: AUDIT_SCHEMA }
    ),
  // Stage 2: adversarially verify each finding from this file, concurrently
  (audit, fileName) => {
    if (!audit || !audit.findings || audit.findings.length === 0) return []
    return parallel(
      audit.findings.map((f) => () =>
        agent(
          `${CONTEXT}

Você é um revisor de segurança CÉTICO e ADVERSÁRIO. Um auditor afirmou que o seguinte endpoint está SEM autenticação. Seu trabalho é REFUTAR essa afirmação, não confirmá-la.

Afirmação:
- Arquivo: ${ROUTE_DIR}/${fileName}
- ${f.method} ${f.path} (linha ${f.line})
- Evidência do auditor: ${f.evidence}
- Severidade proposta: ${f.severity}
- Racional: ${f.rationale}

Leia você mesmo ${ROUTE_DIR}/${fileName}, ${AUTH_FILE} e ${APP_FILE}. Tente encontrar QUALQUER caminho pelo qual \`requireAuth\` (ou equivalente) de fato roda antes deste handler: um router.use(requireAuth) acima da definição, o middleware passado inline, auth aplicada em app.ts, ou re-montagem do router com prefixo protegido. Verifique também se a rota realmente existe e se a linha citada está correta.
Só marque isReal=true se, após tentar genuinamente refutar, o endpoint REALMENTE executa sem autenticação E a autenticação é justificada. Se a falta de auth for intencional e aceitável (ex.: health check público, webhook com verificação de assinatura própria), marque severity 'not-a-vuln' e isReal=false, explicando.
Na dúvida, tenda a refutar. Explique no reasoning o que testaria e o resultado.`,
          { label: `verify:${fileName}:${f.method} ${f.path}`, phase: 'Verify', schema: VERDICT_SCHEMA }
        )
      )
    )
  }
)

const allVerdicts = audits.flat().filter(Boolean)
const confirmed = allVerdicts.filter((v) => v.isReal)

const sevRank = { critical: 0, high: 1, medium: 2, low: 3, 'not-a-vuln': 4 }
confirmed.sort((a, b) => (sevRank[a.severity] ?? 9) - (sevRank[b.severity] ?? 9))

log(`Auditoria concluída: ${allVerdicts.length} achados examinados, ${confirmed.length} confirmados após verificação adversária.`)

return {
  totalFindingsExamined: allVerdicts.length,
  confirmedCount: confirmed.length,
  confirmed,
  refuted: allVerdicts.filter((v) => !v.isReal),
}
