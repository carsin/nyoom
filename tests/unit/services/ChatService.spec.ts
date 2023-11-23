import { ChatService } from '@/services/ChatService';
import { firebaseAuth, db } from "@/firebase-service";
import { writeBatch, collection, query, updateDoc, onSnapshot, orderBy, limit, doc, where, getDocs, serverTimestamp, increment } from 'firebase/firestore';
import { userInfoService } from '../services/UserInfoService';

jest.mock('@/firebase-service');
jest.mock('../services/UserInfoService');
jest.mock("firebase/firestore", () => ({
  writeBatch: jest.fn(() => ({ set: jest.fn(), update: jest.fn(), commit: jest.fn() })),
  collection: jest.fn(),
  query: jest.fn(),
  updateDoc: jest.fn(),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  doc: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  serverTimestamp: jest.fn(),
  increment: jest.fn(),
}));

// mock user
const mockUser = { uid: "testUserId" };
const service = new ChatService(mockUser);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ChatService', () => {
  it('fetches conversations', async () => {
    const mockConversationsData = [
      { id: 'conv1', data: () => ({ participants: ['user1', 'user2'], lastMessageContent: 'Hi', lastMessageTimestamp: new Date(), lastMessageSender: 'user1' }) },
      { id: 'conv2', data: () => ({ participants: ['user2', 'user3'], lastMessageContent: 'Hello', lastMessageTimestamp: new Date(), lastMessageSender: 'user3' }) }
    ];
    getDocs.mockResolvedValueOnce({ docs: mockConversationsData });
    onSnapshot.mockImplementationOnce((query, callback) => callback({ docs: mockConversationsData }));
    userInfoService.fetchUserData = jest.fn().mockResolvedValue({ username: 'testuser', avatarUrl: defaultAvatar });

    const conversations = [];
    const userCache = new Map();
    const unsubscribe = await service.fetchConversations(conversations, userCache);

    expect(getDocs).toHaveBeenCalled();
    expect(conversations.length).toBe(mockConversationsData.length);
    expect(unsubscribe).toBeDefined();
  });

  it('prepares a conversation', async () => {
    userInfoService.fetchUserData = jest.fn().mockResolvedValue({ username: 'recipientUser', avatarUrl: defaultAvatar });
    const conversationOrUser = { id: 'conv1', participants: ['user1', 'user2'] };
    const activeConversation = { value: null };
    const messages = [];

    const result = await service.prepareConversation(conversationOrUser, activeConversation, messages);

    expect(userInfoService.fetchUserData).toHaveBeenCalled();
    expect(result.success).toBeTruthy();
    expect(activeConversation.value).toBeDefined();
  });

  it('sends a message', async () => {
    writeBatch.mockImplementation(() => ({
      set: jest.fn(),
      update: jest.fn(),
      commit: jest.fn(() => Promise.resolve())
    }));
    serverTimestamp.mockImplementation(() => new Date());
    const activeConversation = { value: { id: 'conv1', participants: ['testUserId', 'user2'], unreadCounts: {} } };

    const result = await service.sendMessage(activeConversation, 'Hello');

    expect(writeBatch().commit).toHaveBeenCalled();
    expect(result.success).toBeTruthy();
  });

  it('searches for users', async () => {
    const mockUsersData = [
      { id: 'user1', data: () => ({ username: 'alice' }) },
      { id: 'user2', data: () => ({ username: 'bob' }) }
    ];
    getDocs.mockResolvedValueOnce({ docs: mockUsersData });

    const result = await service.searchUsers('a');

    expect(getDocs).toHaveBeenCalled();
    expect(result).toEqual(mockUsersData.map(doc => ({ uid: doc.id, ...doc.data() })));
  });
});
