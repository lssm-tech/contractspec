import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '@contractspec/lib.ui-kit-web/ui/form';
import { Button, Input, Textarea } from '@contractspec/lib.design-system';
import { useToast } from '@contractspec/lib.ui-kit-web/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@contractspec/lib.ui-kit-web/ui/alert-dialog';
import { useStudioProjectBySlug } from '../../../hooks/studio/queries/useStudioProjectBySlug';
import { useDeleteStudioProject } from '../../../hooks/studio/mutations/useDeleteProject';
import { Skeleton } from '@contractspec/lib.ui-kit-web/ui/skeleton';
import { useGraphQLMutation } from '../../../libs/gql-client';
import { UPDATE_PROJECT_MUTATION } from '../../../hooks/studio/mutations/useUpdateStudioProject';
import type { UpdateProjectInput } from '@contractspec/lib.gql-client-studio';
import {
  DeploymentModeEnum,
  ProjectTierEnum,
} from '@contractspec/lib.gql-client-studio';

const updateProjectSchema = z.object({
  byokEnabled: z.boolean(),
  deploymentMode: z.nativeEnum(DeploymentModeEnum),
  description: z.string(),
  evolutionEnabled: z.boolean(),
  name: z.string().min(1, 'Project name is required'),
  tier: z.nativeEnum(ProjectTierEnum),
});

type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

interface StudioProjectSettingsProps {
  projectSlug: string;
}

export function StudioProjectSettings({
  projectSlug,
}: StudioProjectSettingsProps) {
  const { toast } = useToast();
  const { data, isLoading } = useStudioProjectBySlug(projectSlug);
  const updateProject = useGraphQLMutation(UPDATE_PROJECT_MUTATION);
  const deleteProject = useDeleteStudioProject();
  const project = data?.studioProjectBySlug?.project;

  const form = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      byokEnabled: true,
      deploymentMode: DeploymentModeEnum.Shared,
      description: '',
      evolutionEnabled: true,
      name: '',
      tier: ProjectTierEnum.Starter,
    },
  });

  // Reset form when project data is loaded
  React.useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description ?? '',
      });
    }
  }, [project, form]);

  const onSubmit = (values: UpdateProjectInput) => {
    if (!project) return;
    updateProject.mutate(
      { id: project.id, input: values },
      {
        onSuccess: () => {
          toast({
            title: 'Project updated',
            description: 'Your changes have been saved.',
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to update project.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!project) return;
    deleteProject.mutate(
      { id: project.id },
      {
        onSuccess: () => {
          toast({
            title: 'Project deleted',
            description: 'Redirecting to projects...',
          });
          // Redirect handled by parent or layout typically, but ideally we'd navigate here
          // window.location.href = '/studio/projects'; // Let's avoid direct navigation if possible
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to delete project.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Manage your project's main configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!form.formState.isDirty || updateProject.isPending}
                >
                  {updateProject.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Destructive actions that cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Project</p>
              <p className="text-muted-foreground text-sm">
                Permanently delete this project and all of its data.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your project and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleteProject.isPending}
                  >
                    {deleteProject.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
