import { ManagePostService } from '@/services/ManagePostService';
import { db, firebaseAuth, storage } from "@/firebase-service";
import { doc, getDoc, addDoc, deleteDoc, updateDoc, getDocs, collection, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

jest.mock('@/firebase-service');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Mock Storage functions
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  deleteObject: jest.fn(),
}));

// Mock User
const mockUser = { uid: "testUserId" };
const service = new ManagePostService(mockUser);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ManagePostService', () => {
  it('fetches comments for a post', async () => {
    const mockCommentsData = [
      { id: 'comment1', data: () => ({ userId: 'user1', timestamp: new Date(), text: 'Comment text 1' }) },
      { id: 'comment2', data: () => ({ userId: 'user2', timestamp: new Date(), text: 'Comment text 2' }) }
    ];
    getDocs.mockResolvedValueOnce({ docs: mockCommentsData });

    const result = await service.fetchComments("postId");
    expect(getDocs).toHaveBeenCalled();
    expect(result.success).toBeTruthy();
    expect(result.comments.length).toBe(mockCommentsData.length);
  });

  it('submits a new comment', async () => {
    addDoc.mockResolvedValueOnce({ id: 'newCommentId' });

    const result = await service.submitComment("postId", "This is a comment", "testUser");
    expect(addDoc).toHaveBeenCalled();
    expect(result.success).toBeTruthy();
    expect(result.message).toBe('Comment added!');
  });

  it('deletes a comment', async () => {
    deleteDoc.mockResolvedValueOnce({});

    const result = await service.deleteComment("postId", "commentId");
    expect(deleteDoc).toHaveBeenCalled();
    expect(result.success).toBeTruthy();
    expect(result.message).toBe('Comment deleted successfully');
  });

  it('updates the caption of a post', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ userId: mockUser.uid }) });
    updateDoc.mockResolvedValueOnce({});

    const result = await service.updateCaption("postId", "New caption", "Old caption");
    expect(updateDoc).toHaveBeenCalled();
    expect(result.success).toBeTruthy();
    expect(result.message).toBe("Caption edit confirmed!");
  });
});
