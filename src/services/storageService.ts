import { BlogPost, Comment, SourcingIdea } from '../types';
import { initialBlogPosts } from '../data/blogsData';
import { initialSourcingIdeas } from '../data/sourcingData';

const SOURCING_KEY = 'uddokta_sourcing_ideas_v1';
const BLOGS_KEY = 'uddokta_blogs_v1';
const ADMIN_AUTH_KEY = 'uddokta_admin_session_v1';

export const storageService = {
  getSourcingIdeas(): SourcingIdea[] {
    try {
      const stored = localStorage.getItem(SOURCING_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading sourcing ideas from storage', e);
    }
    // Set initial
    this.saveSourcingIdeas(initialSourcingIdeas);
    return initialSourcingIdeas;
  },

  saveSourcingIdeas(data: SourcingIdea[]): void {
    try {
      localStorage.setItem(SOURCING_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving sourcing ideas', e);
    }
  },

  getSourcingIdeaById(id: string): SourcingIdea | undefined {
    const list = this.getSourcingIdeas();
    return list.find((item) => item.id === id);
  },

  addSourcingIdea(item: Omit<SourcingIdea, 'id' | 'likes' | 'dislikes' | 'comments' | 'lastUpdated'>): SourcingIdea {
    const list = this.getSourcingIdeas();
    const newItem: SourcingIdea = {
      ...item,
      id: `sourcing-${Date.now()}`,
      likes: 0,
      dislikes: 0,
      comments: [],
      lastUpdated: new Date().toLocaleDateString('bn-BD', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
    const updated = [newItem, ...list];
    this.saveSourcingIdeas(updated);
    return newItem;
  },

  updateSourcingIdea(id: string, updates: Partial<SourcingIdea>): SourcingIdea | null {
    const list = this.getSourcingIdeas();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.saveSourcingIdeas(list);
    return list[index];
  },

  deleteSourcingIdea(id: string): boolean {
    const list = this.getSourcingIdeas();
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length !== list.length) {
      this.saveSourcingIdeas(filtered);
      return true;
    }
    return false;
  },

  likeSourcingIdea(id: string, type: 'like' | 'dislike'): SourcingIdea | null {
    const list = this.getSourcingIdeas();
    const item = list.find((s) => s.id === id);
    if (!item) return null;
    if (type === 'like') {
      item.likes += 1;
    } else {
      item.dislikes += 1;
    }
    this.saveSourcingIdeas(list);
    return item;
  },

  addComment(sourcingId: string, authorName: string, text: string, role = 'উদ্যোক্তা'): Comment | null {
    const list = this.getSourcingIdeas();
    const item = list.find((s) => s.id === sourcingId);
    if (!item) return null;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorName: authorName.trim() || 'উদ্যোক্তা',
      authorRole: role,
      comment: text.trim(),
      createdAt: 'এইমাত্র',
      likes: 0,
      replies: []
    };

    if (!item.comments) item.comments = [];
    item.comments.push(newComment);
    this.saveSourcingIdeas(list);
    return newComment;
  },

  // Blogs Management
  getBlogPosts(): BlogPost[] {
    try {
      const stored = localStorage.getItem(BLOGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading blogs from storage', e);
    }
    this.saveBlogPosts(initialBlogPosts);
    return initialBlogPosts;
  },

  saveBlogPosts(data: BlogPost[]): void {
    try {
      localStorage.setItem(BLOGS_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving blogs', e);
    }
  },

  getBlogPostById(id: string): BlogPost | undefined {
    const list = this.getBlogPosts();
    return list.find((b) => b.id === id);
  },

  addBlogPost(post: Omit<BlogPost, 'id' | 'date'>): BlogPost {
    const list = this.getBlogPosts();
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
    const updated = [newPost, ...list];
    this.saveBlogPosts(updated);
    return newPost;
  },

  deleteBlogPost(id: string): boolean {
    const list = this.getBlogPosts();
    const filtered = list.filter((b) => b.id !== id);
    if (filtered.length !== list.length) {
      this.saveBlogPosts(filtered);
      return true;
    }
    return false;
  },

  // Admin Auth
  isAdminLoggedIn(): boolean {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  },

  setAdminLoggedIn(val: boolean): void {
    if (val) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  },

  resetDefaults(): void {
    localStorage.removeItem(SOURCING_KEY);
    localStorage.removeItem(BLOGS_KEY);
  }
};
