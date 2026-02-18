import { useState, useCallback, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import { Header } from './components/layout/Header'
import { Navigation, tabs } from './components/layout/Navigation'
import { Footer } from './components/layout/Footer'
import { LiveTicker } from './components/layout/LiveTicker'
import { ImportIntel } from './components/panels/ImportIntel'
import { PrecisionAg } from './components/panels/PrecisionAg'
import { MillOps } from './components/panels/MillOps'
import { Diversification } from './components/panels/Diversification'
import { Advisory } from './components/panels/Advisory'
import { Roadmap } from './components/panels/Roadmap'
import { SugarMap } from './components/map/SugarMap'
import { CTSLab } from './components/panels/CTSLab'
import { AIDemos } from './components/panels/AIDemos'
import { FactoryDashboard } from './components/panels/FactoryDashboard'
import { FactoryDashboardV2 } from './components/panels/FactoryDashboardV2'
import { Sources } from './components/panels/Sources'
import { useLiveData } from './hooks/useLiveData'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import {
  exportPageAsHtml,
  exportImportIntel,
  exportPrecisionAg,
  exportMillOps,
  exportDiversification,
  exportRoadmap,
  exportMillMap,
  exportCTSLab,
} from './lib/export'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const csvExportMap: Record<string, (() => void) | undefined> = {
  import: exportImportIntel,
  precision: exportPrecisionAg,
  mills: exportMillOps,
  diversify: exportDiversification,
  roadmap: exportRoadmap,
  map: exportMillMap,
  cts: exportCTSLab,
}

function App() {
  const [activeTab, setActiveTab] = useState('import')
  const contentRef = useRef<HTMLDivElement>(null)
  const liveData = useLiveData()

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
  }, [])

  const handleTabChangeByIndex = useCallback((index: number) => {
    if (index >= 0 && index < tabs.length) {
      setActiveTab(tabs[index].id)
    }
  }, [])

  useKeyboardNav(handleTabChangeByIndex, tabs.length)

  const handleExportPdf = async () => {
    if (!contentRef.current) return
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: false,
        useCORS: true,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)

      // Add branding
      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      pdf.text(
        `SugarIQ Intelligence Report — Confidential — Prepared for SASA — ${new Date().toLocaleString('en-ZA')}`,
        10,
        canvas.height / 2 - 10,
      )

      pdf.save(`SugarIQ-Report-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    }
  }

  const handleExportHtml = () => {
    if (!contentRef.current) return
    const tabLabel = tabs.find(t => t.id === activeTab)?.label ?? activeTab

    // For map tab, rasterize the WebGL canvas before cloning
    if (activeTab === 'map') {
      const canvas = contentRef.current.querySelector('canvas')
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png')
        const img = document.createElement('img')
        img.src = dataUrl
        img.style.width = canvas.style.width || `${canvas.width}px`
        img.style.height = canvas.style.height || `${canvas.height}px`
        canvas.parentElement?.insertBefore(img, canvas)
        canvas.style.display = 'none'
        exportPageAsHtml(contentRef.current, tabLabel)
        canvas.style.display = ''
        img.remove()
        return
      }
    }

    exportPageAsHtml(contentRef.current, tabLabel)
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const renderPanel = () => {
    switch (activeTab) {
      case 'import':
        return <ImportIntel key="import" />
      case 'precision':
        return <PrecisionAg key="precision" weather={liveData.weather} />
      case 'mills':
        return <MillOps key="mills" />
      case 'diversify':
        return <Diversification key="diversify" />
      case 'advisory':
        return (
          <Advisory
            key="advisory"
            ollamaModel={liveData.ollamaModel}
            ollamaOnline={liveData.ollamaOnline}
          />
        )
      case 'roadmap':
        return <Roadmap key="roadmap" />
      case 'map':
        return <SugarMap key="map" />
      case 'cts':
        return <CTSLab key="cts" />
      case 'factory':
        return <FactoryDashboard key="factory" />
      case 'factory-v2':
        return <FactoryDashboardV2 key="factory-v2" />
      case 'demos':
        return <AIDemos key="demos" />
      case 'sources':
        return <Sources key="sources" />
      default:
        return <ImportIntel key="import" />
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <Header
        ollamaOnline={liveData.ollamaOnline}
        onExportCsv={csvExportMap[activeTab] ?? null}
        onExportHtml={handleExportHtml}
        onExportPdf={handleExportPdf}
        onFullscreen={handleFullscreen}
      />
      <LiveTicker zarUsd={liveData.zarUsd} weather={liveData.weather} />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" ref={contentRef}>
        <div className="mx-auto max-w-[1600px] p-4">
          <AnimatePresence mode="wait">
            {renderPanel()}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
