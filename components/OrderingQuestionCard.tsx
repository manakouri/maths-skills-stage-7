import React, { useState, useEffect } from 'react';
import { Question, AnswerStatus, FDPValue, ColorTheme } from '../types';
import { Button } from './Button';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface OrderingQuestionCardProps {
  question: Question;
  onSubmit: (answer: FDPValue[]) => void;
  status: AnswerStatus;
  explanation?: React.ReactNode | null;
  isChallengeMode?: boolean;
  correctAnswerForDisplay?: FDPValue[] | null;
  colorTheme?: ColorTheme;
}

const DraggableItem: React.FC<{ item: FDPValue; onDragStart: (e: React.DragEvent, item: FDPValue) => void; isSource?: boolean; colorTheme: ColorTheme; }> = ({ item, onDragStart, isSource = false, colorTheme }) => {
    const baseClasses = "flex items-center justify-center p-4 h-20 text-xl font-bold rounded-xl shadow-md cursor-grab transition-all duration-200 border-2";
    const sourceClasses = "bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:shadow-lg";
    
    const themeDestClasses: Record<ColorTheme, string> = {
        primary: "bg-blue-100 text-blue-800 border-blue-300",
        powers: "bg-red-100 text-red-800 border-red-300",
        rounding: "bg-green-100 text-green-800 border-green-300",
        fractions: "bg-purple-100 text-purple-800 border-purple-300",
        bedmas: "bg-sky-100 text-sky-800 border-sky-300",
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className={`${baseClasses} ${isSource ? sourceClasses : themeDestClasses[colorTheme]}`}
        >
            {item.display}
        </div>
    );
};

const IndicatorLine: React.FC<{ top: string; label: string; colorTheme: ColorTheme; }> = ({ top, label, colorTheme }) => {
    const themeTextClasses: Record<ColorTheme, string> = {
        primary: "text-blue-500", powers: "text-red-500", rounding: "text-green-500",
        fractions: "text-purple-500", bedmas: "text-sky-500",
    };
    const themeBorderClasses: Record<ColorTheme, string> = {
        primary: "border-blue-200", powers: "border-red-200", rounding: "border-green-200",
        fractions: "border-purple-200", bedmas: "border-sky-200",
    };

    return (
        <div className="absolute w-full flex items-center" style={{ top }}>
            <span className={`text-xs font-semibold pr-2 ${themeTextClasses[colorTheme]}`}>{label}</span>
            <div className={`flex-grow border-t-2 border-dashed ${themeBorderClasses[colorTheme]}`}></div>
        </div>
    );
};

export const OrderingQuestionCard: React.FC<OrderingQuestionCardProps> = ({ question, onSubmit, status, explanation, isChallengeMode = false, correctAnswerForDisplay, colorTheme = 'primary' }) => {
    const [sourceItems, setSourceItems] = useState<FDPValue[]>([]);
    const [orderedItems, setOrderedItems] = useState<FDPValue[]>([]);
    const [draggedItem, setDraggedItem] = useState<FDPValue | null>(null);
    
    const themeZoneClasses: Record<ColorTheme, string> = {
        primary: "bg-blue-50/50 border-blue-300", powers: "bg-red-50/50 border-red-300",
        rounding: "bg-green-50/50 border-green-300", fractions: "bg-purple-50/50 border-purple-300",
        bedmas: "bg-sky-50/50 border-sky-300",
    };
    const themeZoneHeaderClasses: Record<ColorTheme, string> = {
        primary: "text-blue-800", powers: "text-red-800", rounding: "text-green-800",
        fractions: "text-purple-800", bedmas: "text-sky-800",
    };


    useEffect(() => {
        setSourceItems(question.items || []);
        setOrderedItems([]);
    }, [question]);

    const handleDragStart = (e: React.DragEvent, item: FDPValue) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            if (e.target instanceof HTMLElement) {
                e.target.style.opacity = '0.5';
            }
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if (e.target instanceof HTMLElement) {
            e.target.style.opacity = '1';
        }
        setDraggedItem(null);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDropOnSource = () => {
        if (!draggedItem || sourceItems.some(i => i.id === draggedItem.id)) return;
        setOrderedItems(orderedItems.filter(i => i.id !== draggedItem.id));
        setSourceItems([...sourceItems, draggedItem]);
    };

    const handleDropOnOrdered = (e: React.DragEvent, dropIndex: number) => {
        if (!draggedItem) return;

        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const isAfter = (e.clientY - rect.top) > (rect.height / 2);
        const finalDropIndex = isAfter ? dropIndex + 1 : dropIndex;
        
        const newOrderedItems = orderedItems.filter(i => i.id !== draggedItem.id);
        newOrderedItems.splice(finalDropIndex, 0, draggedItem);
        
        setOrderedItems(newOrderedItems.slice(0, 5));
        setSourceItems(sourceItems.filter(i => i.id !== draggedItem.id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== AnswerStatus.UNANSWERED) return;
        onSubmit(orderedItems);
    };

    const getBorderColor = () => {
        switch (status) {
            case AnswerStatus.CORRECT: return 'border-green-500';
            case AnswerStatus.INCORRECT: return 'border-red-500';
            default: return 'border-slate-200';
        }
    };

    const isSubmitDisabled = status !== AnswerStatus.UNANSWERED || sourceItems.length > 0 || orderedItems.length < 5;
    
    return (
        <div className={`bg-white p-6 sm:p-8 rounded-xl shadow-xl border ${getBorderColor()}`}>
            <div className="text-center mb-6">
                <p className="text-slate-500 text-lg">Question</p>
                <div className="text-2xl font-bold my-2 text-slate-800">{question.text}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
                <div 
                    className="bg-slate-100 p-4 rounded-xl border-2 border-dashed border-slate-300"
                    onDragOver={handleDragOver}
                    onDrop={handleDropOnSource}
                    onDragEnd={handleDragEnd}
                >
                    <h3 className="font-bold text-center text-slate-600 mb-4">Unordered</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {sourceItems.map(item => (
                            <DraggableItem key={item.id} item={item} onDragStart={handleDragStart} isSource colorTheme={colorTheme}/>
                        ))}
                    </div>
                </div>

                <div className={`p-4 rounded-xl border-2 border-dashed ${themeZoneClasses[colorTheme]}`}>
                    <h3 className={`font-bold text-center mb-4 ${themeZoneHeaderClasses[colorTheme]}`}>Ordered (Smallest to Largest)</h3>
                    <div className="relative space-y-2">
                        <IndicatorLine top="6.75rem" label="50%" colorTheme={colorTheme} />
                        <IndicatorLine top="13.5rem" label="100%" colorTheme={colorTheme} />
                        <IndicatorLine top="20.25rem" label="150%" colorTheme={colorTheme} />

                        {Array.from({ length: 5 }).map((_, index) => (
                           <div 
                             key={index}
                             className="h-20 rounded-lg transition-colors relative z-10"
                             onDragOver={handleDragOver}
                             onDrop={(e) => handleDropOnOrdered(e, index)}
                             onDragEnd={handleDragEnd}
                           >
                               {orderedItems[index] && <DraggableItem item={orderedItems[index]} onDragStart={handleDragStart} colorTheme={colorTheme} />}
                           </div>
                        ))}
                    </div>
                </div>
            </div>
       
            {status === AnswerStatus.INCORRECT && (
              isChallengeMode && correctAnswerForDisplay ? (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-slate-700 text-sm">
                  <h4 className="font-bold mb-2 text-red-800">Correct Order:</h4>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {correctAnswerForDisplay.map(item => (
                      <div key={item.id} className="p-2 text-base font-bold rounded-md bg-slate-200 text-slate-800 border border-slate-300">
                        {item.display}
                      </div>
                    ))}
                  </div>
                </div>
              ) : explanation ? (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-slate-700 text-sm">
                  <h4 className="font-bold mb-2 text-blue-800">How to solve:</h4>
                  {explanation}
                </div>
              ) : null
            )}
            
            <div className="mt-6 relative">
                <Button onClick={handleSubmit} fullWidth disabled={isSubmitDisabled} colorTheme={colorTheme}>
                    Submit Answer
                </Button>
                {status === AnswerStatus.CORRECT && <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 text-green-500"/>}
                {status === AnswerStatus.INCORRECT && !isChallengeMode && <XCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 text-red-500"/>}
            </div>
        </div>
    );
};