
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NavMenu } from './components/NavMenu';
import { CreateTitleComponent } from './components/tabs/CreateTitleComponent';
import { WritePostComponent } from './components/tabs/WritePostComponent';
import { CreateImageComponent } from './components/tabs/CreateImageComponent';
import { RewritePostComponent } from './components/tabs/RewritePostComponent';
import { GenerateCommentsComponent } from './components/tabs/GenerateCommentsComponent';
import { AboutComponent } from './components/tabs/AboutComponent';
import type { GeneratedTitleData, ImageData } from './types';
import { Tab } from './types';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.CreateTitle);
    
    // State is lifted to the highest level to be shared across tabs
    const [generatedData, setGeneratedData] = useState<GeneratedTitleData>({ titles: [], mainTopic: '' });
    const [titleResult, setTitleResult] = useState<string>('');
    const [postResult, setPostResult] = useState<string>('');
    const [rewrittenPostResult, setRewrittenPostResult] = useState<string>('');
    const [imageData, setImageData] = useState<ImageData[]>([]);
    const [imageSegments, setImageSegments] = useState<string[]>([]);

    const handleTitlesGenerated = useCallback((data: GeneratedTitleData) => {
        setGeneratedData(data);
        setTitleResult(data.titles.join('\n'));
    }, []);

    const navigateToImageCreation = useCallback((content: string) => {
        setRewrittenPostResult('');
        setPostResult(content);
        setImageSegments([]);
        setImageData([]);
        setActiveTab(Tab.CreateImage);
    }, []);

    const handlePostGenerated = useCallback((content: string) => {
        navigateToImageCreation(content);
    }, [navigateToImageCreation]);
    
    const handleRewrittenPostGenerated = useCallback((content: string) => {
        navigateToImageCreation(content);
        setRewrittenPostResult(content); // Keep rewritten content
        setPostResult(''); // Clear original post
    }, [navigateToImageCreation]);


    const renderContent = () => {
        const contentForImage = rewrittenPostResult || postResult;

        switch (activeTab) {
            case Tab.CreateTitle:
                return <CreateTitleComponent 
                            onTitlesGenerated={handleTitlesGenerated} 
                            result={titleResult}
                        />;
            case Tab.WritePost:
                return <WritePostComponent 
                            generatedData={generatedData} 
                            onPostGenerated={handlePostGenerated}
                            result={postResult}
                            setResult={setPostResult}
                        />;
            case Tab.CreateImage:
                return <CreateImageComponent 
                            initialContent={contentForImage}
                            imageData={imageData}
                            setImageData={setImageData}
                            segments={imageSegments}
                            setSegments={setImageSegments}
                        />;
            case Tab.RewritePost:
                return <RewritePostComponent 
                            onPostGenerated={handleRewrittenPostGenerated}
                            initialAiPost={postResult}
                            result={rewrittenPostResult}
                            setResult={setRewrittenPostResult}
                        />;
            case Tab.GenerateComments:
                return <GenerateCommentsComponent />;
            case Tab.About:
                return <AboutComponent />;
            default:
                return <CreateTitleComponent onTitlesGenerated={handleTitlesGenerated} result={titleResult} />;
        }
    };

    return (
        <div className="bg-slate-900 text-gray-200 min-h-screen font-sans flex flex-col">
            <Header />
            <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
                <NavMenu activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="flex-grow bg-slate-800/50 rounded-lg border border-cyan-500/20 shadow-2xl shadow-cyan-500/5 p-6 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
