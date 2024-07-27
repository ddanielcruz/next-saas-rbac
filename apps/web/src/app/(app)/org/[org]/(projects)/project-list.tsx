import dayjs from 'dayjs';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import { ArrowRightIcon } from 'lucide-react';

import { getCurrentOrg } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjects } from '@/http/get-projects';
import { getNameInitials } from '@/utils/formatting';

dayjs.extend(dayjsRelativeTime);

export async function ProjectList() {
  const currentOrg = getCurrentOrg()!;
  const { projects } = await getProjects(currentOrg);

  return (
    <div className="grid grid-cols-3 gap-3">
      {projects.map((project) => {
        const ownerFirstName = project.owner.name ? project.owner.name.split(' ')[0] : 'Unknown';

        return (
          <Card key={project.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2 leading-relaxed">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center gap-1.5">
              <Avatar className="size-4">
                {!!project.owner.avatarUrl && <AvatarImage src={project.owner.avatarUrl} />}
                <AvatarFallback className="text-xs">
                  {!!project.owner.name && getNameInitials(project.owner.name, 1)}
                </AvatarFallback>
              </Avatar>

              <span className="text-xs text-muted-foreground">
                Created by <span className="font-medium text-foreground">{ownerFirstName}</span>{' '}
                {dayjs(project.createdAt).fromNow(false)}
              </span>

              <Button className="ml-auto" variant="outline" size="xs">
                View <ArrowRightIcon className="ml-2 size-3" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
