import type { OnboardingAnswer } from '../../../shared/types';

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
