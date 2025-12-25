import { defineCommand } from '@lssm/lib.contracts';
import {
  AnnouncementModel,
  PostAnnouncementInputModel,
} from './announcement.schema';

const OWNERS = ['@examples.team-hub'] as const;

/**
 * Post an announcement.
 */
export const PostAnnouncementContract = defineCommand({
  meta: {
    key: 'team.announcement.post',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'announcement', 'post'],
    description: 'Post an announcement.',
    goal: 'Communicate with team.',
    context: 'Communication.',
  },
  io: {
    input: PostAnnouncementInputModel,
    output: AnnouncementModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'post-announcement-happy-path',
        given: ['User is authenticated'],
        when: ['User posts an announcement'],
        then: ['Announcement is posted and distributed'],
      },
    ],
    examples: [
      {
        key: 'post-general',
        input: {
          spaceId: 'space-123',
          title: 'New Policy',
          content: 'Please read...',
        },
        output: { id: 'ann-456', status: 'posted' },
      },
    ],
  },
});
