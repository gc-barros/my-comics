import { z } from 'zod';

export const comicFormSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'finished'], {
    required_error: 'Please select a status',
  }),
  plannedStartDate: z
    .date({
      required_error: 'Please select a start date',
    })
    .refine(
      date => date >= new Date(new Date().setHours(0, 0, 0, 0)),
      'Start date must be today or later'
    )
    .optional()
    .superRefine((date, ctx) => {
      if (ctx.path[0] === 'plannedStartDate' && ctx.parent.status === 'not_started' && !date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start date is required when status is "Not Started"',
        });
      }
    }),
  currentPage: z
    .number({
      required_error: 'Please enter the current page',
      invalid_type_error: 'Please enter a valid number',
    })
    .min(1, 'Page must be greater than 0')
    .optional()
    .superRefine((page, ctx) => {
      if (ctx.path[0] === 'currentPage' && ctx.parent.status === 'in_progress' && !page) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Current page is required when status is "In Progress"',
        });
      }
    }),
  rating: z
    .number({
      required_error: 'Please select a rating',
      invalid_type_error: 'Please select a valid rating',
    })
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .optional()
    .superRefine((rating, ctx) => {
      if (ctx.path[0] === 'rating' && ctx.parent.status === 'finished' && !rating) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Rating is required when status is "Finished"',
        });
      }
    }),
});

export type ComicFormData = z.infer<typeof comicFormSchema>;
