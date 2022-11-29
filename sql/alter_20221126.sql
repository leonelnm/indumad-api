-- INIT Add fk to invoice
ALTER table job ADD COLUMN IF NOT EXISTS "InvoiceId" INTEGER NULL;
ALTER TABLE job ADD CONSTRAINT "job_InvoiceId_fkey" FOREIGN KEY ("InvoiceId") REFERENCES invoice(id) ON UPDATE CASCADE ON DELETE SET NULL;
-- END Add fk to invoice


-- INIT change job_state
ALTER TYPE enum_job_state ADD VALUE 'Terminado';
ALTER TYPE enum_job_state ADD VALUE 'Cobrado';
ALTER TYPE enum_job_state ADD VALUE 'Anulado';

update job set state = 'Terminado' where state = 'TERMINADO';
update job set state = 'Cobrado' where state = 'COBRADO';
update job set state = 'Anulado' where state = 'ANULADO';


ALTER TYPE enum_job_state RENAME TO enum_job_state_old;

CREATE TYPE enum_job_state AS ENUM('Pte. ASIGNAR',
'Pte. CITA Prof.',
'Esperando Presupuesto',
'Pte. Aprobación Presupuesto',
'En curso',
'Terminado',
'Facturado',
'Pte. COBRO',
'Cobrado',
'Anulado');

ALTER TABLE job ALTER COLUMN state DROP DEFAULT;
ALTER TABLE job ALTER COLUMN state TYPE enum_job_state USING state::text::enum_job_state;
ALTER TABLE job ALTER COLUMN state SET DEFAULT 'Pte. ASIGNAR';
DROP TYPE enum_job_state_old;
-- END change job_state