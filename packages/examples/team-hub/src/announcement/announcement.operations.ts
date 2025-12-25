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
});
