ALTER TABLE public.job ALTER COLUMN "budgetAccepted" DROP NOT NULL;
ALTER TABLE public.job ALTER COLUMN "budgetAccepted" SET DEFAULT null;
ALTER TABLE public.job ADD COLUMN "closedAt" timestamptz NULL;