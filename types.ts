
export enum Tab {
    CreateTitle = 'createTitle',
    WritePost = 'writePost',
    CreateImage = 'createImage',
    RewritePost = 'rewritePost',
    GenerateComments = 'generateComments',
    About = 'about',
}

export interface GeneratedTitleData {
    titles: string[];
    mainTopic: string;
}

export interface ImageData {
    segmentText: string;
    imageUrl: string | null;
    isLoading: boolean;
    regenPrompt: string;
}

export interface CommentStructure {
    khen: string[];
    phanbien: string[];
    khongdongtinh: string[];
    thacmac: string[];
}
