import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarRating } from '../StarRating';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { comicFormSchema, type ComicFormData } from './schema';

interface ComicFormProps {
  totalPages: number;
  onCancel: () => void;
  onSave: (data: ComicFormData) => void;
}

export function ComicForm({ totalPages, onCancel, onSave }: ComicFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ComicFormData>({
    resolver: zodResolver(comicFormSchema),
    defaultValues: {
      status: undefined,
      plannedStartDate: undefined,
      currentPage: undefined,
      rating: undefined,
    },
  });

  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4 relative h-64">
      <div className="grid gap-2">
        <label className="font-semibold">Your Read Status</label>
        <Controller<ComicFormData>
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value?.toString()}>
              <SelectTrigger
                className="bg-primary text-surface border-light-accent/20 focus:ring-light-accent 
                focus:ring-offset-0 w-full"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-primary text-surface border-light-accent/20">
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
      </div>

      {status === 'not_started' && (
        <div className="grid gap-2">
          <label className="font-bold">Planned Start Date</label>
          <Controller<ComicFormData>
            name="plannedStartDate"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-primary text-surface border-light-accent/20',
                      !value && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value as Date, 'dd/MM/yyyy') : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-light-accent/20" align="start">
                  <Calendar
                    className="bg-secondary rounded text-surface"
                    mode="single"
                    selected={value as Date | undefined}
                    onSelect={onChange}
                    initialFocus
                    locale={ptBR}
                    disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.plannedStartDate && (
            <p className="text-sm text-red-500">{errors.plannedStartDate.message}</p>
          )}
        </div>
      )}

      {status === 'in_progress' && (
        <div className="grid gap-2">
          <label htmlFor="currentPage" className="font-bold">
            Current Page
          </label>
          <Controller<ComicFormData>
            name="currentPage"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                id="currentPage"
                type="number"
                min={1}
                max={totalPages}
                value={(value as number)?.toString() || ''}
                onChange={e => onChange(Number(e.target.value))}
                {...field}
                className="bg-primary border-light-accent/20"
              />
            )}
          />
          <p className="text-sm text-light-accent">of {totalPages}</p>
          {errors.currentPage && (
            <p className="text-sm text-red-500">{errors.currentPage.message}</p>
          )}
        </div>
      )}

      {status === 'finished' && (
        <div className="grid gap-2">
          <label className="font-bold">Rating</label>
          <Controller<ComicFormData>
            name="rating"
            control={control}
            render={({ field: { value, onChange } }) => (
              <StarRating value={(value as number) || 0} onChange={onChange} />
            )}
          />
          {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 absolute bottom-0 right-0">
        <Button
          type="button"
          className="w-24 cursor-pointer hover:bg-transparent"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-24 bg-accent hover:bg-accent/90 cursor-pointer">
          Save
        </Button>
      </div>
    </form>
  );
}
