'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();


interface PDFViewerProps {
    pdfUrl: string;
}

/**
 * PDFViewer creates a resizable viewer component
 * @param pdfUrl the URL of the PDF document to render 
 * @returns 
 */
export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const viewerRef = useRef<HTMLDivElement>(null);

    const onDocumentLoadSuccess = useCallback((data: { numPages: number }) => {
        if (!data) return;
        const { numPages } = data;
        setTotalPages(numPages);
    }, []);


    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    const [computedWidth, setComputedWidth] = useState(710); // Default fallback

    React.useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (viewerRef.current) {
                // Trigger a re-render by updating the memo dependency
                setComputedWidth(viewerRef.current.clientWidth || 710);
            }
        });

        if (viewerRef.current) {
            observer.observe(viewerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [viewerRef]);

    return (
        <div id="viewer" className="relative w-full md:w-[70%] xl:w-[50%] 2xl:w-[40%] max-h-screen" ref={viewerRef}>
            <Document
                className="aspect-[545/710] max-h-screen"
                file={pdfUrl}
                loading={
                    <div className="skeleton aspect-[545/710] size-full rounded-none text-center text-gray-500">
                        Loading...
                    </div>
                }
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page width={computedWidth} pageNumber={pageNumber} />
            </Document>
            <div id="pdf-controls" className="flex flex-row gap-5 mt-5
                items-center justify-center place-content-center"
            >
                <button className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-bold border border-indigo-400 px-3 py-1 rounded-lg"
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                    </svg>
                </button>

                <p className="font-medium text-slate-900 dark:text-slate-100">
                    Page {pageNumber || (totalPages ? 1 : '--')} of {totalPages || '--'}
                </p>
                <button className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-bold border border-indigo-400 px-3 py-1 rounded-lg"
                    type="button"
                    disabled={pageNumber >= totalPages}
                    onClick={nextPage}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};