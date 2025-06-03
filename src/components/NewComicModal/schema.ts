import { z } from 'zod';

export const comicFormSchema = z
  .object({
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
      .nullable(),
    currentPage: z
      .number({
        required_error: 'Please enter the current page',
        invalid_type_error: 'Please enter a valid number',
      })
      .min(1, 'Page must be greater than 0')
      .nullable(),
    rating: z
      .number({
        required_error: 'Please select a rating',
        invalid_type_error: 'Please select a valid rating',
      })
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5')
      .nullable(),
  })
  .refine(
    schema => {
      if (schema.status === 'not_started' && !schema.plannedStartDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Start date is required when status is "Not Started"',
      path: ['plannedStartDate'],
    }
  )
  .refine(
    schema => {
      if (schema.status === 'in_progress' && !schema.currentPage) {
        return false;
      }
      return true;
    },
    {
      message: 'Current page is required when status is "In Progress"',
      path: ['currentPage'],
    }
  )
  .refine(
    schema => {
      if (schema.status === 'finished' && !schema.rating) {
        return false;
      }
      return true;
    },
    {
      message: 'Rating is required when status is "Finished"',
      path: ['rating'],
    }
  );

export type ComicFormData = z.infer<typeof comicFormSchema>;
