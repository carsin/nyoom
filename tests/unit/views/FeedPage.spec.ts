import { mount } from '@vue/test-utils';
import FeedPage from '@/views/FeedPage.vue';
import PostCardComponent from '@/components/PostCardComponent.vue';
import { getDocs, query, collection, orderBy } from '@/firebase-service';

const n = 5;
const mockPosts = Array.from({ length: n + 1 }, (_, i) => createMockPost(`${i}`, {
  userId: 'user123',
  username: 'testuser1',
  imageUrl: 'http://example.com/image1.jpg',
  imagePath: '/path/to/image1.jpg',
  caption: 'Beautiful sunset!',
  upvoteCount: 10,
  downvoteCount: 2,
  vehicleMake: 'Toyota',
  vehicleModel: 'Corolla',
  upvoters: ['user456', 'user789'],
  downvoters: ['user101'],
  timestamp: new Date('2022-01-01T12:00:00')
}));

const mockPost1 = createMockPost('1', {
  userId: 'user123',
  username: 'testuser1',
  imageUrl: 'http://example.com/image1.jpg',
  imagePath: '/path/to/image1.jpg',
  caption: 'Beautiful sunset!',
  upvoteCount: 10,
  downvoteCount: 2,
  vehicleMake: 'Toyota',
  vehicleModel: 'Corolla',
  upvoters: ['user456', 'user789'],
  downvoters: ['user101'],
  timestamp: new Date('2022-01-01T12:00:00')
});

const mockPost2 = createMockPost('2', {
  userId: 'user456',
  username: 'testuser2',
  imageUrl: 'http://example.com/image2.jpg',
  imagePath: '/path/to/image2.jpg',
  caption: 'Love this new car!',
  upvoteCount: 5,
  downvoteCount: 0,
  vehicleMake: 'Honda',
  vehicleModel: 'Civic',
  upvoters: ['user123'],
  downvoters: [],
  timestamp: new Date('2022-01-02T15:00:00')
});

const mockPost3 = createMockPost('3', {
  userId: 'user789',
  username: 'testuser3',
  imageUrl: 'http://example.com/image3.jpg',
  imagePath: '/path/to/image3.jpg',
  caption: 'Road trip adventures!',
  upvoteCount: 20,
  downvoteCount: 1,
  vehicleMake: 'Ford',
  vehicleModel: 'Mustang',
  upvoters: ['user123', 'user456', 'user789'],
  downvoters: ['user101'],
  timestamp: new Date('2022-01-03T18:30:00')
});

// mocking firebase firestore
jest.mock('@/firebase-service', () => ({
  getDocs: jest.fn(),
  query: jest.fn(),
  collection: jest.fn(),
  orderBy: jest.fn()
}));

// helper function to create a mock post
function createMockPost(id: string, overrides: object) {
  return {
    id,
    userId: overrides.userId || 'defaultUserId',
    username: overrides.username || 'defaultUsername',
    imageUrl: overrides.imageUrl || 'defaultImageUrl',
    imagePath: overrides.imagePath || 'defaultImagePath',
    caption: overrides.caption || 'defaultCaption',
    upvoteCount: overrides.upvoteCount || 0,
    downvoteCount: overrides.downvoteCount || 0,
    vehicleMake: overrides.vehicleMake || 'defaultMake',
    vehicleModel: overrides.vehicleModel || 'defaultModel',
    upvoters: overrides.upvoters || [],
    downvoters: overrides.downvoters || [],
    timestamp: overrides.timestamp || new Date(),
  };
}

describe('FeedPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render any PostCardComponents when there are no posts', () => {
    const wrapper = mount(FeedPage, {
      props: { posts: [] }
    });
    expect(wrapper.findAllComponents(PostCardComponent).length).toBe(0);
    expect(wrapper.text()).toContain('No posts available.');
  });


  it('renders one PostCardComponent when there is one post', () => {
    const wrapper = mount(FeedPage, {
      props: { posts: [mockPost1] }
    });
    expect(wrapper.findAllComponents(PostCardComponent).length).toBe(1);
  });

  it('renders two PostCardComponents when there are two posts', () => {
    const wrapper = mount(FeedPage, {
      props: { posts: [mockPost1, mockPost2] }
    });
    expect(wrapper.findAllComponents(PostCardComponent).length).toBe(2);
  });

  it('renders multiple PostCardComponents for a typical number of posts', () => {
    const typicalPosts = [mockPost1, mockPost2, mockPost3]; // 3 is typical
    const wrapper = mount(FeedPage, {
      props: { posts: typicalPosts }
    });
    expect(wrapper.findAllComponents(PostCardComponent).length).toBe(typicalPosts.length);
  });


  it(`renders ${n - 1} PostCardComponents when there are ${n - 1} posts`, () => {
    const wrapper = mount(FeedPage, {
      props: { posts: mockPosts.slice(0, n - 1) }
    });
    expect(wrapper.findAllComponents(PostCardComponent).length).toBe(n - 1);
  });

  it(`renders ${n} PostCardComponents when there are ${n} posts`, () => {
    const wrapper = mount(FeedPage, {
      props: { posts: mockPosts.slice(0, n) }
    });
    expect(wrapper.findAllComponents(PostCardComponent).length).toBe(n);
  });

  it(`renders all PostCardComponents when there are more than ${n} posts`, () => {
    const wrapper = mount(FeedPage, {
      props: { posts: mockPosts }
    });

    // component should render all the posts, even if their number exceeds 'n'
    expect(wrapper.findAllComponents(PostCardComponent).length).toBe(mockPosts.length);
  });
});
