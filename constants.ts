
import { Tab } from './types';
import { FileText, Edit, RefreshCw, Bot, Info, ImageIcon, MessageSquare } from './components/ui/Icons';

export const MENU_ITEMS = [ 
    { id: Tab.CreateTitle, label: 'Tạo Tiêu Đề', icon: FileText }, 
    { id: Tab.WritePost, label: 'Viết Bài Đăng', icon: Edit }, 
    { id: Tab.CreateImage, label: 'Tạo Hình Ảnh', icon: ImageIcon }, 
    { id: Tab.RewritePost, label: 'Viết Lại Bài', icon: RefreshCw }, 
    { id: Tab.GenerateComments, label: 'Tạo Bình Luận', icon: MessageSquare },
    { id: Tab.About, label: 'Giới Thiệu', icon: Info }, 
];
