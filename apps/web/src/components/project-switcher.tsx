'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDownIcon, Loader2Icon, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getProjects } from '@/http/get-projects';
import { getNameInitials } from '@/utils/formatting';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FocusRing } from './ui/focus-ring';
import { Skeleton } from './ui/skeleton';

export function ProjectSwitcher() {
  const { org: orgSlug, project: projectSlug } = useParams<{ org: string; project?: string }>();
  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  });

  const currentProject =
    data && projectSlug ? data.projects.find((p) => p.slug === projectSlug) ?? null : null;

  return (
    <DropdownMenu>
      <FocusRing>
        <DropdownMenuTrigger
          className="flex w-[168px] select-none items-center gap-2 rounded p-1 text-sm font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </>
          ) : (
            <>
              {currentProject ? (
                <>
                  <Avatar className="!size-4">
                    {currentProject.avatarUrl && (
                      <AvatarImage src={currentProject.avatarUrl} alt={currentProject.name} />
                    )}
                    <AvatarFallback className="text-xs">
                      {getNameInitials(currentProject.name, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-left">{currentProject.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Select project</span>
              )}
            </>
          )}
          {isLoading ? (
            <Loader2Icon className="ml-auto size-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
          )}
        </DropdownMenuTrigger>
      </FocusRing>
      <DropdownMenuContent align="end" alignOffset={-16} sideOffset={12} className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {data?.projects.map((project) => (
            <DropdownMenuItem key={project.id} asChild>
              <Link href={`/org/${orgSlug}/project/${project.slug}`}>
                <Avatar className="mr-2 !size-4">
                  {project.avatarUrl && <AvatarImage src={project.avatarUrl} alt={project.name} />}
                  <AvatarFallback className="text-xs">
                    {getNameInitials(project.name, 1)}
                  </AvatarFallback>
                </Avatar>
                <span className="line-clamp-1">{project.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/org/${orgSlug}/create-project`}>
            <PlusCircleIcon className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
