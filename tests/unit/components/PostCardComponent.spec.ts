import { mount } from '@vue/test-utils';
import PostCardComponent from '@/components/PostCardComponent.vue';
import { firebaseAuth, db } from "@/firebase-service"; // Mock as necessary
import { useRouter } from 'vue-router';
import { postManager } from '../services/ManagePostService';

jest.mock('@/firebase-service'); // Mock Firebase service
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    go: jest.fn()
  }))
}));

const createComponent = (props = {}) => {
  return mount(PostCardComponent, {
    props: {
      userId: 'defaultUserId',
      imageId: 'defaultImageId',
      username: 'defaultUsername',
      caption: 'defaultCaption',
      upvotes: 10,
      downvotes: 5,
      image_src: 'defaultImageSrc',
      isUpvoted: false,
      isDownvoted: false,
      imagePath: 'defaultImagePath',
      showAvatar: true,
      timestamp: new Date(),
      ...props
    },
    global: {
      mocks: {
        firebaseAuth,
        db,
        useRouter
      }
    }
  });
};

describe('PostCardComponent', () => {
  it('renders correctly based on props', () => {
    const wrapper = createComponent();
    expect(wrapper.find('.post-image').attributes('src')).toBe('defaultImageSrc');
    expect(wrapper.text()).toContain('@defaultUsername');
  });

  it('handles voting correctly', async () => {
    const wrapper = createComponent();
    await wrapper.find('.upvote-button').trigger('click');

    // Check if voting function was called
    expect(postManager.sendVote).toHaveBeenCalledWith('defaultImageId', true);
  });

  it('deletes post when delete button is clicked', async () => {
    const wrapper = createComponent({ isPostOwner: true });
    await wrapper.find('.delete-post-button').trigger('click');

    // Check if delete function was called
    expect(postManager.deletePost).toHaveBeenCalledWith('defaultImageId');
  });

  it('allows editing the caption', async () => {
    const wrapper = createComponent({ isPostOwner: true });
    await wrapper.find('.edit-caption-button').trigger('click');

    // Check if caption editing mode is enabled
    expect(wrapper.find('.edit-caption-area').exists()).toBe(true);
  });
});
