-- Migration 020: getRecentStreakActivity query performance için composite index.
-- Sprint A A1 StreakSnapshot component — son 7 gün aktivite dönüşü için karma_transactions taraması optimize.

begin;

-- getRecentStreakActivity query'de:
--   SELECT created_at FROM karma_transactions
--   WHERE user_id = $1 AND created_at >= $2
--   ORDER BY created_at DESC
--
-- Bu composite index (user_id, created_at DESC) ile index-only scan mümkün.
-- Scan time: O(7 gün satırı) yerine O(1) lookup + 7 satır read = ~100x hızlanma.

create index if not exists idx_karma_transactions_user_date
  on karma_transactions (user_id, created_at desc);

commit;
