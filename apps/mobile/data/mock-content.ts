export type TargetType = 'toeic' | 'ielts';
export type LessonContentType = 'vocabulary' | 'grammar' | 'sentence-pattern';

export interface QuizQuestion {
  id: string;
  instruction: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface LessonContent {
  id: string;
  courseId: string;
  title: string;
  label: string;
  questionCount: number;
  duration: string;
  contentType: LessonContentType;
  description: string;
  theory: string[];
  example: {
    english: string;
    vietnamese: string;
  };
  guidance: string[];
  quiz: QuizQuestion[];
}

export interface CourseContent {
  id: string;
  targetType: TargetType;
  unitLabel: string;
  title: string;
  description: string;
  progressPercent: number;
  duration: string;
  lessonIds: string[];
  lockedAssessmentTitle?: string;
}

export interface TargetContent {
  type: TargetType;
  title: string;
  badge: string;
  modules: string;
  hours: string;
  description: string;
  courseIds: string[];
}

export interface CollectionSummary {
  id: string;
  title: string;
  subtitle: string;
  flashcardCount: number;
  accentColor: string;
  softColor: string;
  icon: string;
  previewWord: string;
  previewMeaning: string;
}

export interface CategorySummary {
  id: string;
  title: string;
  countLabel: string;
  filter: 'Từ vựng' | 'Mẫu câu' | 'Ngữ pháp' | 'Nghe nói';
  collectionId: string;
  colors: [string, string];
  icon: string;
}

export interface ProfileMetric {
  name: string;
  value: number;
  color: string;
}

export interface OnboardingAnswer {
  id: string;
  label: string;
  description?: string;
}

export const targets: TargetContent[] = [
  {
    type: 'toeic',
    title: '500+ TOEIC',
    badge: 'Dễ',
    modules: '16 mô-đun',
    hours: '20 giờ',
    description:
      'Lộ trình TOEIC tập trung vào nền tảng từ vựng, ngữ pháp và phản xạ làm bài để bạn tiến dần tới mốc 500+ một cách có kiểm soát.',
    courseIds: ['toeic-nouns', 'toeic-verbs'],
  },
  {
    type: 'ielts',
    title: '6.0+ IELTS',
    badge: 'Dễ',
    modules: '30 mô-đun',
    hours: '62 tiếng',
    description:
      'Lộ trình IELTS 6.0+ giúp bạn đi từ nền tảng học thuật tới các task thực chiến cho 4 kỹ năng, ưu tiên nhịp học đều và đo tiến độ rõ ràng.',
    courseIds: ['ielts-vocab', 'ielts-sentences'],
  },
];

export const courses: CourseContent[] = [
  {
    id: 'toeic-nouns',
    targetType: 'toeic',
    unitLabel: 'Level 1',
    title: 'Danh từ',
    description:
      'Một trong những phần ngữ pháp nền tảng nhất giúp bạn hiểu cấu trúc câu và tăng tốc ở các câu hỏi đọc hiểu cơ bản.',
    progressPercent: 18,
    duration: '2 giờ',
    lessonIds: ['noun-types', 'noun-position', 'noun-functions'],
    lockedAssessmentTitle: 'Level Test',
  },
  {
    id: 'toeic-verbs',
    targetType: 'toeic',
    unitLabel: 'Level 2',
    title: 'Động từ',
    description:
      'Nhận diện và sử dụng động từ đúng thì, đúng vai trò để tránh lỗi ngữ pháp thường gặp trong bài thi TOEIC.',
    progressPercent: 0,
    duration: '1.5 giờ',
    lessonIds: ['verb-forms'],
    lockedAssessmentTitle: 'Mini Test',
  },
  {
    id: 'ielts-vocab',
    targetType: 'ielts',
    unitLabel: 'Unit 1',
    title: 'Academic Vocabulary',
    description:
      'Bộ từ vựng học thuật xuất hiện thường xuyên trong Reading, Writing và Speaking, được nhóm theo chủ đề để ghi nhớ nhanh hơn.',
    progressPercent: 6,
    duration: '3 giờ',
    lessonIds: ['academic-earth', 'academic-cloud'],
    lockedAssessmentTitle: 'Mock Test 1',
  },
  {
    id: 'ielts-sentences',
    targetType: 'ielts',
    unitLabel: 'Unit 2',
    title: 'Sentence Structures',
    description:
      'Các cấu trúc câu ghép và câu phức giúp bạn nâng band ngữ pháp khi viết và diễn đạt ý rõ ràng hơn khi nói.',
    progressPercent: 0,
    duration: '2.5 giờ',
    lessonIds: ['sentence-basic-patterns'],
    lockedAssessmentTitle: 'Mock Test 2',
  },
];

export const lessons: LessonContent[] = [
  {
    id: 'noun-types',
    courseId: 'toeic-nouns',
    title: 'Các loại danh từ',
    label: 'Loại từ',
    questionCount: 9,
    duration: '9 câu hỏi',
    contentType: 'grammar',
    description: 'Phân biệt danh từ chỉ người, vật, nơi chốn và khái niệm để đọc câu nhanh hơn.',
    theory: [
      'Danh từ dùng để gọi tên người, vật, nơi chốn, sự việc hoặc khái niệm.',
      'Trong câu, danh từ thường đứng sau mạo từ, tính từ sở hữu hoặc tính từ mô tả.',
      'Nhận diện đúng danh từ giúp bạn xác định chủ ngữ, tân ngữ và các cụm danh từ chính xác hơn.',
    ],
    example: {
      english: 'The children are playing in the park.',
      vietnamese: 'Những đứa trẻ đang chơi trong công viên.',
    },
    guidance: [
      'Đọc kỹ ví dụ và tìm từ đóng vai trò gọi tên người hoặc sự vật.',
      'Ghi chú các mẫu cụm danh từ điển hình như “the book”, “my teacher”, “an idea”.',
      'Sau phần lý thuyết, làm quiz để kiểm tra khả năng nhận diện trong câu.',
    ],
    quiz: [
      {
        id: 'nq1',
        instruction: 'Chọn danh từ trong câu sau:',
        prompt: 'The children are playing in the park.',
        options: ['children', 'playing', 'in', 'the'],
        correctAnswer: 'children',
        explanation: '`children` là danh từ chỉ người.',
      },
      {
        id: 'nq2',
        instruction: 'Chọn danh từ trong câu sau:',
        prompt: 'She bought a beautiful book yesterday.',
        options: ['bought', 'beautiful', 'book', 'yesterday'],
        correctAnswer: 'book',
        explanation: '`book` là danh từ chỉ sự vật.',
      },
      {
        id: 'nq3',
        instruction: 'Từ nào là danh từ chỉ nơi chốn?',
        prompt: 'run | hospital | quickly | kind',
        options: ['run', 'hospital', 'quickly', 'kind'],
        correctAnswer: 'hospital',
        explanation: '`hospital` là danh từ chỉ nơi chốn.',
      },
    ],
  },
  {
    id: 'noun-position',
    courseId: 'toeic-nouns',
    title: 'Vị trí danh từ',
    label: 'Lý thuyết',
    questionCount: 9,
    duration: '9 câu hỏi',
    contentType: 'grammar',
    description: 'Xác định vị trí của danh từ trong cụm danh từ và trong cấu trúc câu cơ bản.',
    theory: [
      'Danh từ thường đứng sau mạo từ `a/an/the` hoặc sau tính từ sở hữu như `my`, `their`.',
      'Danh từ có thể làm chủ ngữ ở đầu câu hoặc tân ngữ sau động từ.',
      'Trong bài thi, vị trí của danh từ là dấu hiệu quan trọng để loại đáp án sai loại từ.',
    ],
    example: {
      english: 'The project needs more time.',
      vietnamese: 'Dự án cần thêm thời gian.',
    },
    guidance: [
      'Gạch chân mạo từ hoặc tính từ sở hữu trước khi tìm danh từ.',
      'Kiểm tra xem từ đó có đứng ở vị trí chủ ngữ hoặc tân ngữ không.',
      'Làm quiz để luyện phản xạ loại từ trong ngữ cảnh ngắn.',
    ],
    quiz: [
      {
        id: 'np1',
        instruction: 'Từ nào đứng ở vị trí danh từ trong câu?',
        prompt: 'The project needs more time.',
        options: ['The', 'project', 'needs', 'more'],
        correctAnswer: 'project',
        explanation: '`project` đứng sau mạo từ `the` và làm chủ ngữ.',
      },
      {
        id: 'np2',
        instruction: 'Chọn danh từ làm tân ngữ:',
        prompt: 'We finished the report yesterday.',
        options: ['finished', 'the', 'report', 'yesterday'],
        correctAnswer: 'report',
        explanation: '`report` là tân ngữ của động từ `finished`.',
      },
      {
        id: 'np3',
        instruction: 'Từ nào đứng sau tính từ sở hữu?',
        prompt: 'Her manager arrives early.',
        options: ['Her', 'manager', 'arrives', 'early'],
        correctAnswer: 'manager',
        explanation: '`manager` đứng sau `Her`, nên đó là danh từ.',
      },
    ],
  },
  {
    id: 'noun-functions',
    courseId: 'toeic-nouns',
    title: 'Chức năng của danh từ',
    label: 'Lý thuyết',
    questionCount: 9,
    duration: '9 câu hỏi',
    contentType: 'grammar',
    description: 'Hiểu chức năng chủ ngữ, bổ ngữ và tân ngữ của danh từ trong câu.',
    theory: [
      'Danh từ có thể làm chủ ngữ: đứng trước động từ chính.',
      'Danh từ có thể làm tân ngữ: đứng sau động từ hoặc giới từ.',
      'Danh từ cũng có thể làm bổ ngữ sau động từ nối như `is`, `become`, `remain`.',
    ],
    example: {
      english: 'Innovation drives progress.',
      vietnamese: 'Sự đổi mới thúc đẩy tiến bộ.',
    },
    guidance: [
      'Tìm động từ chính trước, sau đó xác định danh từ đang đóng vai trò gì.',
      'So sánh vị trí trước và sau động từ để phân biệt chủ ngữ với tân ngữ.',
      'Quiz tập trung vào nhận diện chức năng thay vì chỉ gọi tên loại từ.',
    ],
    quiz: [
      {
        id: 'nf1',
        instruction: 'Từ nào là chủ ngữ?',
        prompt: 'Innovation drives progress.',
        options: ['Innovation', 'drives', 'progress', 'none'],
        correctAnswer: 'Innovation',
        explanation: '`Innovation` đứng trước động từ `drives` và làm chủ ngữ.',
      },
      {
        id: 'nf2',
        instruction: 'Danh từ nào là tân ngữ?',
        prompt: 'The teacher explained the lesson clearly.',
        options: ['teacher', 'explained', 'lesson', 'clearly'],
        correctAnswer: 'lesson',
        explanation: '`lesson` là tân ngữ của động từ `explained`.',
      },
      {
        id: 'nf3',
        instruction: 'Danh từ nào là bổ ngữ?',
        prompt: 'She became a manager last year.',
        options: ['She', 'became', 'manager', 'year'],
        correctAnswer: 'manager',
        explanation: '`manager` là bổ ngữ sau động từ nối `became`.',
      },
    ],
  },
  {
    id: 'verb-forms',
    courseId: 'toeic-verbs',
    title: 'Dạng động từ cơ bản',
    label: 'Loại từ',
    questionCount: 8,
    duration: '8 câu hỏi',
    contentType: 'grammar',
    description: 'Tổng hợp các dạng động từ cơ bản và vai trò của chúng trong câu.',
    theory: [
      'Động từ thể hiện hành động hoặc trạng thái của chủ ngữ.',
      'Dạng của động từ thay đổi theo thì, chủ ngữ và cấu trúc câu.',
      'Nhận diện đúng động từ giúp bạn xác định xương sống của câu nhanh hơn.',
    ],
    example: {
      english: 'She works in marketing.',
      vietnamese: 'Cô ấy làm việc trong lĩnh vực marketing.',
    },
    guidance: [
      'Tìm động từ chính trước khi phân tích thành phần khác.',
      'Đối chiếu chủ ngữ để nhận diện chia động từ số ít hay số nhiều.',
      'Làm quiz để luyện nhận diện động từ trong câu ngắn.',
    ],
    quiz: [
      {
        id: 'vf1',
        instruction: 'Từ nào là động từ?',
        prompt: 'She works in marketing.',
        options: ['She', 'works', 'in', 'marketing'],
        correctAnswer: 'works',
        explanation: '`works` là động từ chính của câu.',
      },
      {
        id: 'vf2',
        instruction: 'Từ nào là động từ?',
        prompt: 'They are preparing the report.',
        options: ['They', 'are', 'preparing', 'report'],
        correctAnswer: 'preparing',
        explanation: '`preparing` là động từ chính trong thì hiện tại tiếp diễn.',
      },
    ],
  },
  {
    id: 'academic-earth',
    courseId: 'ielts-vocab',
    title: 'Earth',
    label: 'Mặt trời',
    questionCount: 6,
    duration: '3 phút 15 giây',
    contentType: 'vocabulary',
    description: 'Từ vựng học thuật chủ đề Trái đất, môi trường và bối cảnh nghiên cứu.',
    theory: [
      'Vocabulary screen trong Figma tập trung vào một từ khóa lớn, nghĩa, phát âm và các nút nghe/chậm.',
      'Ở phase core, nội dung được gộp vào lesson template và mô phỏng bằng phần theory + example + quiz.',
    ],
    example: {
      english: 'The Earth is facing major climate challenges.',
      vietnamese: 'Trái đất đang đối mặt với những thách thức khí hậu lớn.',
    },
    guidance: [
      'Đọc từ khóa, nghĩa và đặt nó vào một câu hoàn chỉnh.',
      'Lặp lại câu mẫu để ghi nhớ cách dùng trong bối cảnh học thuật.',
      'Quiz kiểm tra nhận diện nghĩa và ngữ cảnh của từ.',
    ],
    quiz: [
      {
        id: 'ae1',
        instruction: 'Từ `Earth` gần nghĩa nhất với:',
        prompt: 'Chọn nghĩa đúng của từ khóa.',
        options: ['Mặt trời', 'Trái đất', 'Khí hậu', 'Đại dương'],
        correctAnswer: 'Trái đất',
        explanation: '`Earth` nghĩa là Trái đất.',
      },
      {
        id: 'ae2',
        instruction: 'Chọn ngữ cảnh dùng đúng:',
        prompt: 'The Earth is facing major climate challenges.',
        options: ['Một hành tinh', 'Một công việc', 'Một môn học', 'Một hành động'],
        correctAnswer: 'Một hành tinh',
        explanation: 'Câu đang nói về Trái đất như một hành tinh.',
      },
    ],
  },
  {
    id: 'academic-cloud',
    courseId: 'ielts-vocab',
    title: 'Cloud',
    label: 'Mây',
    questionCount: 6,
    duration: '3 phút 15 giây',
    contentType: 'vocabulary',
    description: 'Từ vựng nền tảng trong các chủ đề thời tiết, môi trường và mô tả hiện tượng tự nhiên.',
    theory: [
      'Cloud là từ vựng cơ bản nhưng thường xuất hiện trong mô tả biểu đồ hoặc chủ đề môi trường.',
      'Khi học IELTS, cần ghi nhớ cả nghĩa gốc và nghĩa mở rộng theo văn cảnh.',
    ],
    example: {
      english: 'Dark clouds usually signal heavy rain.',
      vietnamese: 'Mây đen thường báo hiệu mưa lớn.',
    },
    guidance: [
      'Liên kết từ mới với hình ảnh hoặc hiện tượng quen thuộc.',
      'Đặt từ vào một câu hoàn chỉnh thay vì học riêng lẻ.',
      'Quiz tập trung vào nghĩa và ngữ cảnh sử dụng.',
    ],
    quiz: [
      {
        id: 'ac1',
        instruction: 'Cloud nghĩa là gì?',
        prompt: 'Chọn đáp án đúng nhất.',
        options: ['Gió', 'Mây', 'Sấm', 'Sương'],
        correctAnswer: 'Mây',
        explanation: '`Cloud` nghĩa là mây.',
      },
      {
        id: 'ac2',
        instruction: 'Câu nào dùng `cloud` đúng ngữ cảnh?',
        prompt: 'Chọn ngữ cảnh mô tả hiện tượng tự nhiên.',
        options: [
          'Cloud helps me finish homework.',
          'A cloud covered the mountain.',
          'Cloud is my favorite verb.',
          'We cloud the report.',
        ],
        correctAnswer: 'A cloud covered the mountain.',
        explanation: '`cloud` ở đây được dùng như danh từ chỉ mây.',
      },
    ],
  },
  {
    id: 'sentence-basic-patterns',
    courseId: 'ielts-sentences',
    title: 'Mẫu câu cơ bản',
    label: 'Mẫu câu',
    questionCount: 7,
    duration: '7 câu hỏi',
    contentType: 'sentence-pattern',
    description: 'Làm quen với các mẫu câu cơ bản để diễn đạt ý rõ ràng và có logic.',
    theory: [
      'Một câu hoàn chỉnh tối thiểu cần chủ ngữ và động từ.',
      'Mẫu câu đơn rõ ràng là nền tảng để viết câu ghép và câu phức.',
      'Trong IELTS Writing, ưu tiên sự chính xác trước khi tăng độ phức tạp.',
    ],
    example: {
      english: 'Students need clear goals to improve faster.',
      vietnamese: 'Học viên cần mục tiêu rõ ràng để tiến bộ nhanh hơn.',
    },
    guidance: [
      'Xác định chủ ngữ và động từ trước khi mở rộng câu.',
      'Viết lại câu mẫu với chủ đề gần gũi của bạn.',
      'Quiz kiểm tra khả năng nhận diện thành phần cốt lõi của câu.',
    ],
    quiz: [
      {
        id: 'sp1',
        instruction: 'Cụm nào là chủ ngữ của câu?',
        prompt: 'Students need clear goals to improve faster.',
        options: ['Students', 'need', 'clear goals', 'improve faster'],
        correctAnswer: 'Students',
        explanation: '`Students` là chủ ngữ.',
      },
      {
        id: 'sp2',
        instruction: 'Động từ chính là:',
        prompt: 'Students need clear goals to improve faster.',
        options: ['Students', 'need', 'clear', 'goals'],
        correctAnswer: 'need',
        explanation: '`need` là động từ chính.',
      },
    ],
  },
];

export const collections: CollectionSummary[] = [
  {
    id: 'toeic-500',
    title: '500+ TOEIC',
    subtitle: '20 flashcard',
    flashcardCount: 20,
    accentColor: '#f7c948',
    softColor: '#fff4d6',
    icon: 'school-outline',
    previewWord: 'Present',
    previewMeaning: 'Hiện tại',
  },
  {
    id: 'basic-speaking',
    title: 'Giao tiếp cơ bản',
    subtitle: '10 flashcard',
    flashcardCount: 10,
    accentColor: '#ff7e54',
    softColor: '#ffe1d4',
    icon: 'chatbubbles-outline',
    previewWord: 'Hello',
    previewMeaning: 'Xin chào',
  },
  {
    id: 'basic-grammar',
    title: 'Ngữ pháp cơ bản',
    subtitle: '16 flashcard',
    flashcardCount: 16,
    accentColor: '#ff6b6b',
    softColor: '#ffe3e3',
    icon: 'book-outline',
    previewWord: 'Noun',
    previewMeaning: 'Danh từ',
  },
];

export const categories: CategorySummary[] = [
  {
    id: 'all',
    title: 'Tất cả',
    countLabel: '100 flashcard',
    filter: 'Từ vựng',
    collectionId: 'toeic-500',
    colors: ['#5cc56e', '#38b455'],
    icon: 'grid-outline',
  },
  {
    id: 'cat-speaking',
    title: 'Giao tiếp cơ bản',
    countLabel: '20 flashcard',
    filter: 'Nghe nói',
    collectionId: 'basic-speaking',
    colors: ['#ff9a7a', '#ff7e54'],
    icon: 'chatbubbles-outline',
  },
  {
    id: 'cat-grammar',
    title: 'Ngữ pháp',
    countLabel: '30 flashcard',
    filter: 'Ngữ pháp',
    collectionId: 'basic-grammar',
    colors: ['#9ed0fe', '#6faef5'],
    icon: 'book-outline',
  },
  {
    id: 'cat-toeic',
    title: '500+ TOEIC',
    countLabel: '15 flashcard',
    filter: 'Từ vựng',
    collectionId: 'toeic-500',
    colors: ['#f6d365', '#fda085'],
    icon: 'school-outline',
  },
];

export const profileMetrics: ProfileMetric[] = [
  { name: 'Phát âm', value: 85, color: '#4facfe' },
  { name: 'Trôi chảy', value: 70, color: '#f5576c' },
  { name: 'Nghe', value: 90, color: '#00bd50' },
  { name: 'Đọc', value: 75, color: '#ffa100' },
  { name: 'Ngữ điệu', value: 80, color: '#7e7bec' },
];

export const onboardingOptions = {
  goals: [
    'Không gì cả',
    'Học tập',
    'Công việc',
    'Giao tiếp hằng ngày',
    'Kết bạn bốn phương',
    'Khác',
  ] satisfies string[],
  dailyTime: ['5 phút/ngày', '10 phút/ngày', '15 phút/ngày', '20 phút/ngày'] satisfies string[],
  learningModes: [
    {
      id: 'from-start',
      label: 'Bắt đầu từ đầu',
      description: 'Bắt đầu trải nghiệm học tập cùng SUMO ngay bây giờ.',
    },
    {
      id: 'placement-test',
      label: 'Học đúng trình độ',
      description: 'Làm một bài kiểm tra ngắn để bỏ qua các bài học trình độ thấp hơn.',
    },
  ] satisfies OnboardingAnswer[],
};

export const achievements = [
  {
    id: 'ach-1',
    title: 'Thời gian học tập',
    level: 'BẬC 1 TRÊN 10',
    description: 'Học 10 phút với Sumo',
    icon: 'time-outline',
    color: '#ff9a9e',
  },
  {
    id: 'ach-2',
    title: 'Thợ săn ngôi sao',
    level: 'BẬC 1 TRÊN 10',
    description: 'Thu thập 10 sao',
    icon: 'star-outline',
    color: '#f6d365',
  },
  {
    id: 'ach-3',
    title: 'Siêu cấp chăm chỉ',
    level: 'BẬC 1 TRÊN 10',
    description: 'Duy trì streak 3 ngày',
    icon: 'flame-outline',
    color: '#ff0844',
  },
];

export function getTarget(type?: string) {
  return targets.find((item) => item.type === type) ?? targets[0];
}

export function getCourse(courseId?: string) {
  return courses.find((item) => item.id === courseId) ?? courses[0];
}

export function getLessonsByCourse(courseId: string) {
  return lessons.filter((item) => item.courseId === courseId);
}

export function getLesson(lessonId?: string) {
  return lessons.find((item) => item.id === lessonId) ?? lessons[0];
}

export function getCollection(collectionId?: string) {
  return collections.find((item) => item.id === collectionId) ?? collections[0];
}
