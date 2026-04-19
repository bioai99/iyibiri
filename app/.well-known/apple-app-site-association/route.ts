export async function GET() {
  return Response.json({
    applinks: {
      apps: [],
      details: [{
        appID: "F55594YN87.com.iyibiri.app",
        paths: ["/auth/callback*", "/g/*", "/stk/*"],
      }],
    },
  }, {
    headers: { "Content-Type": "application/json" },
  })
}
