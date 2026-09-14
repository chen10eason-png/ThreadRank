/**
 * V1 data adapter placeholder.
 * IMPORTANT: Meta's official Threads API does not expose a complete public-platform firehose.
 * Replace `discoverCandidatePosts()` with a permitted data source available to your project.
 * The rest of this file is intentionally separated so the ranking website does not depend on one provider.
 */

async function discoverCandidatePosts() {
  console.log('No public-wide Threads data provider configured yet.');
  return [];
}

async function main() {
  const candidates = await discoverCandidatePosts();
  console.log(`Discovered ${candidates.length} candidate posts.`);
  // TODO: fetch permitted metrics, then upsert posts + hourly snapshots into Supabase.
}

main().catch(err => { console.error(err); process.exit(1); });
