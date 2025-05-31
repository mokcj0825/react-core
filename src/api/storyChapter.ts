import { StoryChapterDB } from '../services/StoryChapterDB';

export const storyChapterHandlers = {
  async setChapter(chapter: string): Promise<void> {
    await StoryChapterDB.getInstance().setStoryChapter(chapter);
  },

  async getChapter(): Promise<string | null> {
    return await StoryChapterDB.getInstance().getStoryChapter();
  }
}; 