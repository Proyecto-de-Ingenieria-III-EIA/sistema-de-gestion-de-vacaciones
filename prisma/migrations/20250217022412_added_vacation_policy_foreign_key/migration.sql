-- AddForeignKey
ALTER TABLE "Vacation_Absence" ADD CONSTRAINT "vacation_policy_fk" FOREIGN KEY ("policy_under") REFERENCES "Vacation_Policy"("vp_id") ON DELETE RESTRICT ON UPDATE CASCADE;
