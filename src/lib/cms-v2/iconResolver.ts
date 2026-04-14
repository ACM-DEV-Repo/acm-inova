// ============================================================
// Icon Resolver V2 — Mapeia nome string → componente Lucide
// ============================================================
// Usado nos landing components pra renderizar ícones salvos no CMS.
// Backward compatible: se icon não definido, usa fallback do array antigo.
// ============================================================

import {
  // Geral
  Home, Sparkles, Star, Heart, Zap, Target, Lightbulb, Rocket,
  Flame, Eye, Gift, Sun, Crown, Gem, Medal, Award, Trophy,
  Flag, Bookmark, Bell, CircleDot, Hexagon, Diamond,

  // Saúde & Medicina
  Stethoscope, Activity, Brain, HeartPulse, Pill, Syringe,
  Thermometer, Hospital, Ambulance, Microscope, TestTubes,
  Dna, Baby, Scan, Cross, ShieldPlus, Bone, Ear,
  HandHeart,

  // Pessoas & Social
  Users, User, UserCheck, UserPlus, UsersRound,
  PersonStanding, Handshake,

  // Comunicação
  PhoneCall, Phone, MessageCircle, Mail, MailOpen, Send,
  Share2, Megaphone, Headphones, Video, Radio,

  // Tempo & Agenda
  Clock, Calendar, CalendarCheck, CalendarDays, Timer, Hourglass, AlarmClock,

  // Educação & Conhecimento
  GraduationCap, BookOpen, Book, Library, PenTool, FileText,
  NotebookPen, Presentation, School,

  // Segurança & Confiança
  Shield, Lock, CheckCircle, ThumbsUp, ShieldCheck, BadgeCheck, CircleCheck,

  // Negócio & Métricas
  TrendingUp, BarChart3, DollarSign, Percent, Package, Truck,
  Briefcase, PieChart, LineChart, Receipt, Wallet, HandCoins,

  // Localização & Espaço
  MapPin, Map, Navigation, Building, Building2, Landmark, Compass,
  Globe, MapPinned, LocateFixed,

  // Natureza
  Leaf, Mountain, TreePine, Flower2, Droplets, CloudSun,

  // Tech & Ferramentas
  Settings, Wifi, Code, Cpu, Wrench, Monitor, Smartphone,
  QrCode, Fingerprint, CircuitBoard, DatabaseZap,
  Search, Filter, Download, Upload, Link, Camera,
  Laptop, Server,

  type LucideIcon,
} from "lucide-react";

/** Mapa completo: nome string → componente Lucide */
export const ICON_MAP: Record<string, LucideIcon> = {
  // ── Geral ──
  home: Home,
  sparkles: Sparkles,
  star: Star,
  heart: Heart,
  zap: Zap,
  target: Target,
  lightbulb: Lightbulb,
  rocket: Rocket,
  flame: Flame,
  eye: Eye,
  gift: Gift,
  sun: Sun,
  crown: Crown,
  gem: Gem,
  medal: Medal,
  award: Award,
  trophy: Trophy,
  flag: Flag,
  bookmark: Bookmark,
  bell: Bell,
  'circle-dot': CircleDot,
  hexagon: Hexagon,
  diamond: Diamond,

  // ── Saúde & Medicina ──
  stethoscope: Stethoscope,
  activity: Activity,
  brain: Brain,
  'heart-pulse': HeartPulse,
  pill: Pill,
  syringe: Syringe,
  thermometer: Thermometer,
  hospital: Hospital,
  ambulance: Ambulance,
  microscope: Microscope,
  'test-tubes': TestTubes,
  dna: Dna,
  baby: Baby,
  scan: Scan,
  cross: Cross,
  'shield-plus': ShieldPlus,
  bone: Bone,
  ear: Ear,
  'hand-heart': HandHeart,

  // ── Pessoas & Social ──
  users: Users,
  user: User,
  'user-check': UserCheck,
  'user-plus': UserPlus,
  'users-round': UsersRound,
  'person-standing': PersonStanding,
  handshake: Handshake,

  // ── Comunicação ──
  'phone-call': PhoneCall,
  phone: Phone,
  'message-circle': MessageCircle,
  mail: Mail,
  'mail-open': MailOpen,
  send: Send,
  'share-2': Share2,
  megaphone: Megaphone,
  headphones: Headphones,
  video: Video,
  radio: Radio,

  // ── Tempo & Agenda ──
  clock: Clock,
  calendar: Calendar,
  'calendar-check': CalendarCheck,
  'calendar-days': CalendarDays,
  timer: Timer,
  hourglass: Hourglass,
  'alarm-clock': AlarmClock,

  // ── Educação & Conhecimento ──
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  book: Book,
  library: Library,
  'pen-tool': PenTool,
  'file-text': FileText,
  'notebook-pen': NotebookPen,
  presentation: Presentation,
  school: School,

  // ── Segurança & Confiança ──
  shield: Shield,
  lock: Lock,
  'check-circle': CheckCircle,
  'thumbs-up': ThumbsUp,
  'shield-check': ShieldCheck,
  'badge-check': BadgeCheck,
  'circle-check': CircleCheck,

  // ── Negócio & Métricas ──
  'trending-up': TrendingUp,
  'bar-chart': BarChart3,
  'dollar-sign': DollarSign,
  percent: Percent,
  package: Package,
  truck: Truck,
  briefcase: Briefcase,
  'pie-chart': PieChart,
  'line-chart': LineChart,
  receipt: Receipt,
  wallet: Wallet,
  'hand-coins': HandCoins,

  // ── Localização & Espaço ──
  'map-pin': MapPin,
  map: Map,
  navigation: Navigation,
  building: Building,
  'building-2': Building2,
  landmark: Landmark,
  compass: Compass,
  globe: Globe,
  'map-pinned': MapPinned,
  'locate-fixed': LocateFixed,

  // ── Natureza ──
  leaf: Leaf,
  mountain: Mountain,
  'tree-pine': TreePine,
  'flower-2': Flower2,
  droplets: Droplets,
  'cloud-sun': CloudSun,

  // ── Tech & Ferramentas ──
  settings: Settings,
  wifi: Wifi,
  code: Code,
  cpu: Cpu,
  wrench: Wrench,
  monitor: Monitor,
  smartphone: Smartphone,
  'qr-code': QrCode,
  fingerprint: Fingerprint,
  'circuit-board': CircuitBoard,
  'database-zap': DatabaseZap,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  link: Link,
  camera: Camera,
  laptop: Laptop,
  server: Server,
};

/** Categorias para o IconPickerV2 */
export const ICON_CATEGORIES: Record<string, string[]> = {
  'Saúde & Medicina': [
    'stethoscope', 'activity', 'brain', 'heart-pulse', 'pill', 'syringe',
    'thermometer', 'hospital', 'ambulance', 'microscope', 'test-tubes',
    'dna', 'baby', 'scan', 'cross', 'shield-plus', 'bone', 'ear', 'hand-heart',
  ],
  'Geral': [
    'home', 'sparkles', 'star', 'heart', 'zap', 'target', 'lightbulb',
    'rocket', 'flame', 'eye', 'gift', 'sun', 'crown', 'gem', 'medal',
    'award', 'trophy', 'flag', 'bookmark', 'bell', 'circle-dot', 'hexagon', 'diamond',
  ],
  'Pessoas': [
    'users', 'user', 'user-check', 'user-plus', 'users-round',
    'person-standing', 'handshake',
  ],
  'Comunicação': [
    'phone-call', 'phone', 'message-circle', 'mail', 'mail-open',
    'send', 'share-2', 'megaphone', 'headphones', 'video', 'radio',
  ],
  'Educação': [
    'graduation-cap', 'book-open', 'book', 'library', 'pen-tool',
    'file-text', 'notebook-pen', 'presentation', 'school',
  ],
  'Tempo & Agenda': [
    'clock', 'calendar', 'calendar-check', 'calendar-days',
    'timer', 'hourglass', 'alarm-clock',
  ],
  'Confiança': [
    'shield', 'lock', 'check-circle', 'thumbs-up',
    'shield-check', 'badge-check', 'circle-check',
  ],
  'Negócio': [
    'trending-up', 'bar-chart', 'dollar-sign', 'percent', 'package',
    'truck', 'briefcase', 'pie-chart', 'line-chart', 'receipt', 'wallet', 'hand-coins',
  ],
  'Localização': [
    'map-pin', 'map', 'navigation', 'building', 'building-2',
    'landmark', 'compass', 'globe', 'map-pinned', 'locate-fixed',
  ],
  'Natureza': [
    'leaf', 'mountain', 'tree-pine', 'flower-2', 'droplets', 'cloud-sun',
  ],
  'Tech & Ferramentas': [
    'settings', 'wifi', 'code', 'cpu', 'wrench', 'monitor', 'smartphone',
    'qr-code', 'fingerprint', 'circuit-board', 'database-zap',
    'search', 'filter', 'download', 'upload', 'link', 'camera', 'laptop', 'server',
  ],
};

/**
 * Resolve nome de ícone → componente Lucide
 * @param iconName - nome do ícone salvo no CMS (ex: "shield", "heart")
 * @param fallback - componente fallback se nome não encontrado
 */
export function resolveIcon(iconName?: string, fallback?: LucideIcon): LucideIcon {
  if (!iconName) return fallback || Sparkles;
  return ICON_MAP[iconName] || fallback || Sparkles;
}
