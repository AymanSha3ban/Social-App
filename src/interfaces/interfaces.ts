

export interface CounterContextType {
    counter: number;
    incrementCounter: () => void;
}

export interface AuthContextType {
    isAuthed: string | null;
    setIsAuthed: (isAuthed: string | null) => void;
}
export interface PostContextType {
  isLoading: boolean | null;
  isError: boolean | null;
  data: PostType[] ;
  refetch: () => void;
}

export interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export interface PostType {
  id?: number | string;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  likedBy?: string[];
  mediaURL: string;
  views: number;
  userId: number | string;
  price?: number;
  categoryName?: string;
  brandName?: string;
  createdAt?: string;
}

export interface AddPostType {
  id?: number | string;
  title: string;
  body: string;
  tags?: string[] | undefined;
  reactions: {
    likes: number;
    dislikes: number;
  };
  likedBy?: string[];
  mediaURL: string;
  views: number;
  userId: string | number;
  price?: number;
  categoryName?: string;
}

export interface CommentType {
  id?: number | string;
  body: string;
  postId: number | string;
  likes: number;
  user: {
    id: number | string;
    username: string; 
    fullName: string;
    avatar?: string;
  };
  createdAt?: string;
}

export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface RouteProductType {
  _id: string;
  id?: string;
  title: string;
  slug?: string;
  description: string;
  quantity?: number;
  price: number;
  imageCover: string;
  images?: string[];
  category?: {
    _id: string;
    name: string;
    slug: string;
    image?: string;
  };
  brand?: {
    _id: string;
    name: string;
    slug: string;
    image?: string;
  };
  ratingsAverage?: number;
  ratingsQuantity?: number;
  sold?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Story {
  id: string;
  mediaUrl: string;
}

export interface UserAddress {
  city: string;
  country: string;
}

export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  birth?: string; 
  gender: string;
  phone: string;
  image?: string;
  coverPath?: string;
  stories: Story[];
  address: UserAddress;
  followers?: string[];
  following?: string[];
  bio?: string;
}

export interface StoryType {
  id?: number | string; 
  mediaUrl: string; 
}

export interface PaginatedPosts {
  first?: number;
  prev: number | null;
  next: number | null;
  last?: number;
  pages: number;
  items?: number;
  data: PostType[];
}

export interface IReactions {
  postId: string;
  reactions: {
    likes: number;
    dislikes: number;
  };
  likedBy?: string[];
}