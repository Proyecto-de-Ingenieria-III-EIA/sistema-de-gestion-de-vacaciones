import { AbsenceNotFoundError } from '@/errors/AbsenceNotFoundError';
import { OurContext } from '../context';
import { IncorrectInputError } from '@/errors/IncorrectInputError';
import { ExistingJustificationError } from '@/errors/ExistingJustificationError';
import {
  Enum_Requested_Absence_Status_Name,
  Enum_Spotaneus_Absence_Status_Name,
  Justification,
} from '@prisma/client';
import { NonExistentJustificationError } from '@/errors/NonExistentJustificationError';
import { messages } from '../notification_absence/messages';
import { AbsenceHasBeenResolvedError } from '@/errors/AbsenceHasBeenResolvedError';

interface JustificationCreationInput {
  absenceId: string;
  description: string;
  media: string;
}

const justificationResolvers = {
  Mutation: {
    createJustification: async (
      parent: null,
      { input }: { input: JustificationCreationInput },
      { db }: OurContext
    ) => {
      const absence = await db.absence.findFirst({
        where: {
          dbId: input.absenceId,
        },
      });
      if (!absence) throw new AbsenceNotFoundError();

      const existingJustification = await db.justification.findFirst({
        where: {
          absenceId: input.absenceId,
        },
      });
      if (existingJustification) throw new ExistingJustificationError();

      if (!input.description)
        throw new IncorrectInputError(
          'The justification must have a description'
        );

      return await db.$transaction(async (tx) => {
        await tx.absenceNotification.update({
          where: {
            absenceId: input.absenceId,
          },
          data: {
            isForBoss: true,
            hasBeenSeen: false,
            message: messages.justificationCreation,
          },
        });

        return await tx.justification.create({
          data: {
            ...input,
            updatedAt: new Date(),
          },
        });
      });
    },
    updateJustification: async (
      parent: null,
      { input }: { input: JustificationCreationInput },
      { db }: OurContext
    ) => {
      const existingJustification = await db.justification.findFirst({
        where: {
          absenceId: input.absenceId,
        },
      });
      if (!existingJustification) throw new NonExistentJustificationError();

      // Verify that the absence has not been resolved
      // Requested absence
      const reqAbsenName: { name: string }[] = await db.$queryRaw`
                SELECT
                    absenStatus.name
                FROM
                    "Requested_Absence" as reqAbsen
                    INNER JOIN "Request_Status" as absenStatus
                        ON reqAbsen."status" = absenStatus."db_id"
                WHERE
                    reqAbsen."absence_id" = ${input.absenceId}
                ;
            `;

      if (reqAbsenName.length !== 0)
        if (reqAbsenName[0].name !== Enum_Requested_Absence_Status_Name.PENDING)
          // If it is a requested absence check the status
          // Nested `if`, so if this fails, it does not run the query for the spontaneous absence
          throw new AbsenceHasBeenResolvedError();
        else {
          // Then it has to be spontaneous absence
          // Spontaneous absence
          const spontAbsenName: { name: string }[] = await db.$queryRaw`
                    SELECT
                        absenStatus.name
                    FROM
                        "Spontaneous_Absence" as spotAbsen
                        INNER JOIN "Spontaneous_Absence_Status" as absenStatus
                            ON spotAbsen."status" = absenStatus."db_id"
                    WHERE
                        spotAbsen."absence_id" = ${input.absenceId}
                    ;
                `;

          if (
            spontAbsenName.length !== 0 &&
            spontAbsenName[0].name !==
              Enum_Spotaneus_Absence_Status_Name.PENDING
          )
            throw new AbsenceHasBeenResolvedError();
        }

      // Now update the justification
      if (input.description)
        existingJustification.description = input.description;

      if (input.media) existingJustification.media = input.media;

      return await db.justification.update({
        where: {
          absenceId: input.absenceId,
        },
        data: {
          description: existingJustification.description,
          media: existingJustification.media,
        },
      });
    },
    addCommentToJustification: async (
      parent: null,
      args: { absenceId: string; comments: string },
      { db }: OurContext
    ) => {
      if (
        (await db.justification.count({
          where: {
            absenceId: args.absenceId,
          },
        })) === 0
      )
        throw new NonExistentJustificationError();

      return await db.justification.update({
        where: {
          absenceId: args.absenceId,
        },
        data: {
          comments: args.comments,
        },
      });
    },
  },
  Justification: {
    informalAbsence: async (
      parent: Justification,
      args: null,
      context: OurContext
    ) => {
      return await context.db.informalAbsence.findFirst({
        where: {
          absenceId: parent.absenceId,
        },
      });
    },
    spontaneousAbsence: async (
      parent: Justification,
      args: null,
      context: OurContext
    ) => {
      return await context.db.spontaneousAbsence.findFirst({
        where: {
          absenceId: parent.absenceId,
        },
      });
    },
  },
};

export { justificationResolvers };
