'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StarRating } from '../StarRating';

type ComicStatus = 'not_started' | 'in_progress' | 'finished';

interface NewComicModalProps {
  children: React.ReactNode;
}

export function NewComicModal({ children }: NewComicModalProps) {
  const [status, setStatus] = useState<ComicStatus>('not_started');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [search, setSearch] = useState('');

  const resetFields = () => {
    setStatus('not_started');
    setCurrentPage(0);
    setRating(0);
    setSearch('');
  };

  return (
    <Dialog onOpenChange={open => !open && resetFields()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-primary text-surface border-secondary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-surface">Add New Comic</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="search" className="text-sm font-medium">
              Comic Title
            </label>
            <Input
              id="search"
              placeholder="Search comic"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-primary text-surface placeholder:text-light-accent/50 border-light-accent/20 focus-visible:ring-light-accent focus-visible:ring-offset-0"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Reading Status</label>
            <Select value={status} onValueChange={value => setStatus(value as ComicStatus)}>
              <SelectTrigger className="bg-primary text-surface border-light-accent/20 focus:ring-light-accent focus:ring-offset-0">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-primary text-surface border-light-accent/20">
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status === 'in_progress' && (
            <div className="grid gap-2">
              <label htmlFor="currentPage" className="text-sm font-medium">
                Current Page
              </label>
              <Input
                type="number"
                id="currentPage"
                placeholder="Current page"
                value={currentPage}
                onChange={e => setCurrentPage(Number(e.target.value))}
                min={0}
                className="bg-primary text-surface placeholder:text-light-accent/50 border-light-accent/20 focus-visible:ring-light-accent focus-visible:ring-offset-0"
              />
            </div>
          )}
          {status === 'finished' && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">Rating</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <div className="grid grid-cols-2 gap-2">
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-light-accent/20 text-surface hover:bg-primary hover:text-surface cursor-pointer w-[100px]"
              >
                Cancel
              </Button>
            </DialogTrigger>
            <Button className="bg-accent hover:bg-accent/90 text-surface cursor-pointer w-[100px]">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
