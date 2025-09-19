
import React from 'react';

export const AboutComponent: React.FC = () => (
    <div className="text-gray-300 h-full flex flex-col justify-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Về Cộng Đồng ETA</h2>
        <p className="mb-4">Cộng đồng chuyên nghiên cứu và áp dụng công nghệ, AI vào công tác giáo dục. Chúng tôi thường xuyên tổ chức các buổi đào tạo miễn phí, với nội dung luôn bám sát thực tế và nhu cầu cấp thiết của giáo viên.</p>
        <p className="mb-6">ETA cam kết liên tục chia sẻ các tài nguyên giá trị, các công cụ tiên tiến và những phương pháp sư phạm hiện đại nhất tới cộng đồng giáo viên Việt Nam.</p>
        <div className="space-y-3 text-sm">
            <p><strong>Người sáng lập và điều hành:</strong> Nguyễn Thành Được - 0904059866</p>
            <p><strong>Website chính:</strong> <a href="https://dangkyhoc.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://dangkyhoc.com</a></p>
            <p><strong>Group Facebook:</strong> <a href="https://www.facebook.com/groups/1250754953361054" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Tham gia ngay</a></p>
            <p><strong>Group Zalo trao đổi học tập:</strong></p>
            <ul className="list-disc list-inside pl-4">
                <li><a href="https://zalo.me/g/hbskqp268" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Group năm học mới 2025-2026</a></li>
                <li><a href="https://zalo.me/g/vliomq401" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Group Zalo 1</a></li>
                <li><a href="https://zalo.me/g/pdnxju956" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Group Zalo 2</a></li>
                <li><a href="https://zalo.me/g/cmbhdu647" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Group Zalo 3</a></li>
            </ul>
        </div>
    </div>
);
