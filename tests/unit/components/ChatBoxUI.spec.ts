import { mount } from '@vue/test-utils';
import ChatBoxUI from '@/components/ChatBoxUI.vue';

const mockMessages = [
  createMockMessage('1', { senderId: 'user1', content: 'Hello from user1!', readStatus: true, timestamp: new Date('2022-01-01T08:00:00') }),
  createMockMessage('2', { senderId: 'user2', content: 'Hi there, this is user2.', readStatus: false, timestamp: new Date('2022-01-01T09:00:00') }),
  createMockMessage('3', { senderId: 'user3', content: 'Good morning!', readStatus: true, timestamp: new Date('2022-01-01T10:00:00') }),
  createMockMessage('4', { senderId: 'user1', content: 'How are you today?', readStatus: false, timestamp: new Date('2022-01-01T11:00:00') }),
  createMockMessage('5', { senderId: 'user2', content: 'I’m doing great, thanks!', readStatus: true, timestamp: new Date('2022-01-01T12:00:00') }),
  createMockMessage('6', { senderId: 'user3', content: 'Anyone up for lunch?', readStatus: false, timestamp: new Date('2022-01-01T13:00:00') }),
  createMockMessage('7', { senderId: 'user1', content: 'Count me in!', readStatus: true, timestamp: new Date('2022-01-01T14:00:00') }),
  createMockMessage('8', { senderId: 'user2', content: 'See you there.', readStatus: false, timestamp: new Date('2022-01-01T15:00:00') }),
  createMockMessage('9', { senderId: 'user3', content: 'Can’t wait!', readStatus: true, timestamp: new Date('2022-01-01T16:00:00') }),
  createMockMessage('10', { senderId: 'user1', content: 'It’s going to be fun.', readStatus: false, timestamp: new Date('2022-01-01T17:00:00') })
];

function createMockMessage(id: string, overrides: object) {
  const defaultTimestamp = new Date(); // Default timestamp

  return {
    id,
    senderId: overrides.senderId || 'defaultSenderId',
    content: overrides.content || 'Default message content',
    timestamp: overrides.timestamp || defaultTimestamp,
    readStatus: overrides.readStatus !== undefined ? overrides.readStatus : false,
    ...overrides
  };
}

// helper function to mock Firestore data
const mockFirestoreData = (data) => {
  getDocs.mockImplementation(() => Promise.resolve({
    docs: data.map(item => ({ id: item.id, data: () => item }))
  }));
};

// Mocking Firebase Firestore
jest.mock('@/firebase-service', () => ({
  getDocs: jest.fn(),
  query: jest.fn(),
  collection: jest.fn(),
  orderBy: jest.fn()
}));

describe('FeedPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render any message items when there are no messages', () => {
    const wrapper = mount(ChatBoxUI, {
      props: { messages: [] }
    });
    expect(wrapper.findAll('.message-item').length).toBe(0);
  });

  it('renders one message item when there is one message', () => {
    const wrapper = mount(ChatBoxUI, {
      props: { messages: [mockMessages[0]] }
    });
    expect(wrapper.findAll('.message-item').length).toBe(1);
  });

  it('renders two message items when there are two messages', () => {
    const wrapper = mount(ChatBoxUI, {
      props: { messages: [mockMessages[0], mockMessages[1]] }
    });
    expect(wrapper.findAll('.message-item').length).toBe(2);
  });

  it('renders multiple message items for a typical number of messages', () => {
    const typicalMessages = mockMessages.slice(0, 5); // 5 is typical
    const wrapper = mount(ChatBoxUI, {
      props: { messages: typicalMessages }
    });
    expect(wrapper.findAll('.message-item').length).toBe(typicalMessages.length);
  });

  const n = 10;

  it(`renders ${n - 1} message items when there are ${n - 1} messages`, () => {
    const wrapper = mount(ChatBoxUI, {
      props: { messages: mockMessages.slice(0, n - 1) }
    });
    expect(wrapper.findAll('.message-item').length).toBe(n - 1);
  });

  it(`renders ${n} message items when there are ${n} messages`, () => {
    const wrapper = mount(ChatBoxUI, {
      props: { messages: mockMessages.slice(0, n) }
    });
    expect(wrapper.findAll('.message-item').length).toBe(n);
  });
  it(`renders all message items when there are more than ${n} messages`, () => {
    const wrapper = mount(ChatBoxUI, {
      props: { messages: mockMessages }
    });
    expect(wrapper.findAll('.message-item').length).toBe(mockMessages.length);
  });
});
