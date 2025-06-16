import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StarRating } from '@/components/StarRating';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { ptBR } from 'date-fns/locale';
import { comicFormSchema, type ComicFormData } from '../../types/comicFormSchema';

interface ComicFormProps {
  initialData: Partial<ComicFormData> & { pageCount: number };
  onSubmit: (data: ComicFormData) => void;
  submitLabel?: string;
}

export function ComicForm({ initialData, onSubmit, submitLabel = 'Save' }: ComicFormProps) {
  const form = useForm<ComicFormData>({
    resolver: zodResolver(comicFormSchema(initialData.pageCount)),
    defaultValues: {
      status: initialData.status || 'not_started',
      plannedStartDate: initialData.plannedStartDate,
      currentPage: initialData.currentPage,
      rating: initialData.rating,
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit, errors => {
    console.warn('Erro de validação:', errors);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className="bg-primary text-surface border-light-accent/20 focus:ring-light-accent 
                focus:ring-offset-0 w-full"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-primary text-surface border-light-accent/20">
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('status') === 'not_started' && (
          <FormField
            control={form.control}
            name="plannedStartDate"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Planned Start Date</FormLabel>
                <FormControl>
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
                        selected={value instanceof Date ? value : undefined}
                        onSelect={onChange}
                        initialFocus
                        locale={ptBR}
                        disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch('status') === 'in_progress' && (
          <FormField
            control={form.control}
            name="currentPage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Page</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    onChange={e => field.onChange(Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch('status') === 'finished' && (
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <StarRating value={field.value || 0} onChange={field.onChange} size="default" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 cursor-pointer">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
