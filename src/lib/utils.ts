import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 生成唯一ID
export function uid() {
  return (
    Math.random().toString(36).slice(2) + Date.now().toString(36)
  );
}

// 检查是否可以使用本地存储
export function canUseStorage() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

// 日期相关工具函数
export function daysBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const d1 = new Date(a).setHours(0, 0, 0, 0);
  const d2 = new Date(b).setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((d2 - d1) / 86400000));
}

export function daysTogether(since: string) {
  return since ? daysBetween(since, new Date().toISOString()) : 0;
}

// 格式化日期
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 格式化日期时间
export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 获取星座
export function getZodiacSign(date: string | Date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "白羊座";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "金牛座";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "双子座";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "巨蟹座";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "狮子座";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "处女座";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "天秤座";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "天蝎座";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "射手座";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "摩羯座";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "水瓶座";
  return "双鱼座";
}

// 获取生肖
export function getChineseZodiac(date: string | Date) {
  const year = new Date(date).getFullYear();
  const animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  return animals[(year - 4) % 12];
}

// 计算年龄
export function calculateAge(birthdate: string | Date) {
  const birth = new Date(birthdate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}
