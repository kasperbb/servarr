import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSonarr } from './fetch-sonarr';
import { type } from 'arktype';

interface UseDownloadEpisodeMutateArguments {
  id: number | undefined;
}

export function useDownloadEpisode() {
  const queryClient = useQueryClient();
  const { toast, dismiss } = useToast();

  return useMutation(
    async ({ id }) => {
      if (!id) {
        throw new Error('The useDownloadEpisode mutation expects an id.');
      }

      toast({
        title: 'Adding to queue...',
        description: 'This may take a few moments.',
      });

      return await fetchSonarr({
        path: '/command',
        options: {
          method: 'POST',
          body: JSON.stringify({
            episodeIds: [id],
            name: 'episodesearch',
          }),
        },
        schema: type('unknown'),
      });
    },
    {
      onMutate: async ({}: UseDownloadEpisodeMutateArguments) => {},
      onError: () => {
        dismiss();
        queryClient.invalidateQueries(['queue']);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['queue']);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['queue']);
      },
    }
  );
}
