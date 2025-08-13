import { LucideIcon } from "lucide-react";

// 偏好类别
export const PREFERENCE_CATEGORIES = [
  { id: "food", label: "食物", icon: "Coffee" },
  { id: "drink", label: "饮品", icon: "Wine" },
  { id: "dessert", label: "甜点", icon: "CandyCane" },
  { id: "fashion", label: "服饰", icon: "Shirt" },
  { id: "fragrance", label: "香水", icon: "Star" },
  { id: "music", label: "音乐", icon: "Music" },
  { id: "activity", label: "活动", icon: "Dumbbell" },
  { id: "place", label: "地点", icon: "MapPin" },
  { id: "movie", label: "电影", icon: "Film" },
  { id: "book", label: "书籍", icon: "BookOpen" },
  { id: "color", label: "颜色", icon: "Palette" },
  { id: "other", label: "其他", icon: "Sparkles" },
] as const;

export type PreferenceCategory = typeof PREFERENCE_CATEGORIES[number]['id'];

// 事件类型
export const EVENT_TYPES = [
  { id: "date", label: "约会", icon: "Heart" },
  { id: "gift", label: "礼物", icon: "Gift" },
  { id: "memory", label: "回忆", icon: "BookMarked" },
  { id: "milestone", label: "里程碑", icon: "CalendarDays" },
  { id: "anniversary", label: "纪念日", icon: "Cake" },
] as const;

export type EventType = typeof EVENT_TYPES[number]['id'];

// 偏好
export interface Preference {
  id: string;
  category: PreferenceCategory;
  label: string;
  note?: string;
  importance: number; // 1-5
}

// 链接
export interface Link {
  label: string;
  url: string;
}

// 事件
export interface Event {
  id: string;
  type: EventType;
  title: string;
  when: string; // ISO日期字符串
  place?: string;
  note?: string;
}

// 人物
export interface Person {
  id: string;
  name: string;
  emoji: string;
  birthday?: string; // ISO日期字符串
  togetherSince?: string; // ISO日期字符串
  links: Link[];
  preferences: Preference[];
  events: Event[];
}

// 数据库
export interface DB {
  people: Person[];
}

// 示例数据
export const demoData = (): DB => ({
  people: [
    {
      id: "demo-1",
      name: "小艾",
      emoji: "🌿",
      birthday: "1995-05-15",
      togetherSince: new Date().toISOString().slice(0, 10),
      links: [{ label: "微信", url: "https://weixin.qq.com/" }],
      preferences: [
        {
          id: "pref-1",
          category: "food",
          label: "寿司",
          note: "特别喜欢三文鱼",
          importance: 4,
        },
        { 
          id: "pref-2", 
          category: "drink", 
          label: "燕麦拿铁", 
          note: "不加糖", 
          importance: 5 
        },
        {
          id: "pref-3",
          category: "fragrance",
          label: "祖马龙海盐与鼠尾草",
          note: "日常香水",
          importance: 3,
        },
      ],
      events: [
        {
          id: "event-1",
          type: "date",
          title: "第一次雨中漫步",
          when: new Date().toISOString(),
          place: "滨江公园",
          note: "共用一把伞，笑声不断",
        },
        {
          id: "event-2",
          type: "gift",
          title: "手写明信片",
          when: new Date().toISOString(),
          note: "她把它夹在了书里",
        },
      ],
    },
  ],
}); 