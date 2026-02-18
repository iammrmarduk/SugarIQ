import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { mills, millRegions, ctsLabs } from '../../lib/mill-coordinates'
import type { Mill } from '../../lib/mill-coordinates'
import { Map as MapIcon, Layers, FlaskConical } from 'lucide-react'
import { AnimatedPanel } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { cn } from '../../lib/utils'
import { exportMillMap } from '../../lib/export'

const statusColors: Record<string, string> = {
  operating: '#22c55e',
  closed: '#ef4444',
  suspended: '#f59e0b',
}

const statusLabels: Record<string, string> = {
  operating: 'Operating',
  closed: 'Closed',
  suspended: 'Suspended',
}

const tongaatMillIds = new Set(['maidstone', 'amatikulu', 'felixton', 'darnall'])

function createPopupContent(mill: Mill, hasCtsLab: boolean): string {
  const statusColor = statusColors[mill.status]
  const isTongaat = tongaatMillIds.has(mill.id)
  return `
    <div style="font-family: system-ui, sans-serif; min-width: 220px;">
      ${isTongaat ? `
        <div style="background: #ef444420; border: 1px solid #ef444440; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px;">
          <div style="font-size: 10px; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">⚠ Tongaat Hulett — Liquidation Filed 12 Feb 2026</div>
          <div style="font-size: 11px; color: #fca5a5; margin-top: 3px;">Vision/IDC funding collapsed. R900M unpaid SASA levies. ${mill.status === 'operating' ? 'Mill continues operating — leads SA in sugar recovery.' : 'Mill mothballed since 2020.'} DTIC Minister intervening.</div>
        </div>
      ` : ''}
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #f8fafc;">${mill.name}</h3>
        <span style="font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 12px; background: ${statusColor}20; color: ${statusColor}; border: 1px solid ${statusColor}40;">
          ${statusLabels[mill.status]}
        </span>
      </div>
      <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8;">${mill.company}${isTongaat ? ' <span style="color: #ef4444; font-weight: 600;">(Liquidation)</span>' : ''}</p>
      ${mill.status === 'operating' ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
          <div style="background: #1e293b80; padding: 6px 8px; border-radius: 6px;">
            <div style="font-size: 10px; color: #64748b;">Capacity</div>
            <div style="font-size: 13px; font-weight: 600; color: #f8fafc;">${mill.capacity}</div>
          </div>
          <div style="background: #1e293b80; padding: 6px 8px; border-radius: 6px;">
            <div style="font-size: 10px; color: #64748b;">Efficiency</div>
            <div style="font-size: 13px; font-weight: 600; color: ${mill.efficiency >= 92 ? '#22c55e' : mill.efficiency >= 90 ? '#f59e0b' : '#ef4444'};">${mill.efficiency}%</div>
          </div>
          <div style="background: #1e293b80; padding: 6px 8px; border-radius: 6px;">
            <div style="font-size: 10px; color: #64748b;">Throughput</div>
            <div style="font-size: 13px; font-weight: 600; color: #f8fafc;">${mill.throughput}</div>
          </div>
          ${mill.cogenMW ? `
          <div style="background: #1e293b80; padding: 6px 8px; border-radius: 6px;">
            <div style="font-size: 10px; color: #64748b;">Co-gen</div>
            <div style="font-size: 13px; font-weight: 600; color: #fbbf24;">${mill.cogenMW} MW</div>
          </div>` : ''}
        </div>
      ` : ''}
      ${hasCtsLab ? `
        <div style="background: #06b6d420; border: 1px solid #06b6d440; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px;">
          <div style="font-size: 10px; font-weight: 600; color: #06b6d4;">🧪 CTS Laboratory</div>
          <div style="font-size: 11px; color: #67e8f9; margin-top: 2px;">Cane Testing Service — DAC sampling & RV analysis for grower payments</div>
        </div>
      ` : ''}
      ${mill.maintenanceAlert ? `
        <div style="background: #f59e0b15; border: 1px solid #f59e0b30; border-radius: 6px; padding: 6px 8px; margin-top: 4px;">
          <div style="font-size: 10px; font-weight: 600; color: #f59e0b;">Maintenance Alert</div>
          <div style="font-size: 11px; color: #fbbf24; margin-top: 2px;">${mill.maintenanceAlert}</div>
        </div>
      ` : ''}
      ${mill.notes && !isTongaat ? `
        <p style="margin: 8px 0 0; font-size: 11px; color: #64748b; font-style: italic;">${mill.notes}</p>
      ` : ''}
    </div>
  `
}

export function SugarMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [showCts, setShowCts] = useState(true)
  const ctsMarkers = useRef<maplibregl.Marker[]>([])
  const millMarkers = useRef<Record<string, maplibregl.Marker>>({})

  useEffect(() => {
    if (!mapContainer.current) return

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [31.0, -28.5],
      zoom: 6.2,
      minZoom: 5,
      maxZoom: 15,
    })

    m.addControl(new maplibregl.NavigationControl(), 'top-right')

    m.on('load', () => {
      const ctsMillIds = new Set(ctsLabs.map((l) => l.millId))

      // Add mill markers
      mills.forEach((mill) => {
        const wrapper = document.createElement('div')
        wrapper.style.cursor = 'pointer'
        wrapper.style.display = 'flex'
        wrapper.style.alignItems = 'center'
        wrapper.style.justifyContent = 'center'

        const isTongaat = tongaatMillIds.has(mill.id)

        const dot = document.createElement('div')
        const size = mill.status === 'operating' ? 16 : 12
        dot.style.width = `${size}px`
        dot.style.height = `${size}px`
        dot.style.borderRadius = '50%'
        dot.style.backgroundColor = isTongaat && mill.status === 'operating' ? '#f59e0b' : statusColors[mill.status]
        dot.style.border = isTongaat ? '2px solid #ef4444' : '2px solid #0f172a'
        dot.style.transition = 'transform 0.2s ease'

        // Tongaat mills get a pulsing box-shadow instead of a separate element
        if (isTongaat && mill.status === 'operating') {
          dot.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.4), 0 0 12px rgba(239,68,68,0.3)'
          dot.style.animation = 'pulse-glow-red 2s ease-in-out infinite'
        } else {
          dot.style.boxShadow = `0 0 8px ${statusColors[mill.status]}60`
        }

        wrapper.appendChild(dot)

        wrapper.addEventListener('mouseenter', () => {
          dot.style.transform = 'scale(1.5)'
        })
        wrapper.addEventListener('mouseleave', () => {
          dot.style.transform = 'scale(1)'
        })

        const hasCts = ctsMillIds.has(mill.id)

        const popup = new maplibregl.Popup({
          offset: 15,
          closeButton: true,
          maxWidth: '320px',
        }).setHTML(createPopupContent(mill, hasCts))

        const marker = new maplibregl.Marker({ element: wrapper, anchor: 'center' })
          .setLngLat([mill.lng, mill.lat])
          .setPopup(popup)
          .addTo(m)

        millMarkers.current[mill.id] = marker
      })

      // Add CTS lab ring markers (offset slightly so both are visible)
      ctsLabs.forEach((lab) => {
        const mill = mills.find((m) => m.id === lab.millId)
        if (!mill) return

        const wrapper = document.createElement('div')
        wrapper.style.cursor = 'pointer'

        const ring = document.createElement('div')
        ring.style.width = '24px'
        ring.style.height = '24px'
        ring.style.borderRadius = '50%'
        ring.style.border = '2px solid #06b6d4'
        ring.style.backgroundColor = 'transparent'
        ring.style.boxShadow = '0 0 6px #06b6d440'
        ring.style.transition = 'transform 0.2s ease'

        wrapper.appendChild(ring)

        wrapper.addEventListener('mouseenter', () => {
          ring.style.transform = 'scale(1.3)'
        })
        wrapper.addEventListener('mouseleave', () => {
          ring.style.transform = 'scale(1)'
        })

        const popup = new maplibregl.Popup({
          offset: 15,
          closeButton: true,
          maxWidth: '280px',
        }).setHTML(`
          <div style="font-family: system-ui, sans-serif;">
            <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #06b6d4;">🧪 ${lab.name}</h3>
            <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8;">Cane Testing Service Laboratory</p>
            <div style="font-size: 11px; color: #cbd5e1; line-height: 1.5;">
              <strong>Services:</strong> Direct Analysis of Cane (DAC), Recoverable Value (RV) determination, mill balance analysis, weekly reconciliation<br/>
              <strong>Purpose:</strong> Ensuring accurate, fair payments between millers and growers<br/>
              <strong>Region:</strong> ${lab.region}
            </div>
          </div>
        `)

        const marker = new maplibregl.Marker({ element: wrapper, anchor: 'center' })
          .setLngLat([mill.lng, mill.lat])
          .setPopup(popup)
          .addTo(m)

        ctsMarkers.current.push(marker)
      })

      setLoaded(true)
    })

    map.current = m

    return () => m.remove()
  }, [])

  // Toggle CTS markers visibility
  useEffect(() => {
    ctsMarkers.current.forEach((marker) => {
      marker.getElement().style.display = showCts ? '' : 'none'
    })
  }, [showCts])

  return (
    <AnimatedPanel>
      <SectionTitle
        icon={MapIcon}
        title="Interactive Mill & Lab Map"
        subtitle="12 operating mills + 11 CTS laboratories across KwaZulu-Natal and Mpumalanga"
        iconColor="text-emerald-400"
        onExport={exportMillMap}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-xl border border-slate-700/50">
            <div ref={mapContainer} className="h-[550px] w-full" />
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="text-sm text-slate-400">Loading map...</div>
              </div>
            )}
          </div>
        </div>

        {/* Legend + Mill List */}
        <div className="space-y-4">
          {/* Status Legend */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Layers className="h-4 w-4 text-slate-400" />
              Legend
            </h3>
            <div className="space-y-2">
              {Object.entries(statusLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: statusColors[key],
                      boxShadow: `0 0 6px ${statusColors[key]}40`,
                    }}
                  />
                  <span className="text-xs text-slate-300">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full border-2"
                  style={{ borderColor: '#ef4444', backgroundColor: '#f59e0b' }}
                />
                <span className="text-xs text-red-400">Tongaat Hulett (Liquidation)</span>
              </div>
              {/* CTS toggle */}
              <button
                onClick={() => setShowCts((v) => !v)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-1 py-0.5 transition-colors',
                  showCts ? 'opacity-100' : 'opacity-40',
                )}
              >
                <div
                  className="h-3 w-3 rounded-full border-2"
                  style={{ borderColor: '#06b6d4' }}
                />
                <span className="text-xs text-cyan-300">CTS Labs ({ctsLabs.length})</span>
              </button>
            </div>

            <div className="mt-4 border-t border-slate-700 pt-3">
              <h4 className="mb-2 text-xs font-medium text-slate-400">Regions</h4>
              {millRegions.map((region) => (
                <div key={region.name} className="flex items-center gap-2 py-0.5">
                  <div
                    className="h-2 w-4 rounded-sm"
                    style={{ backgroundColor: region.color }}
                  />
                  <span className="text-[11px] text-slate-400">{region.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTS Info Card */}
          <div className="rounded-xl border border-cyan-800/30 bg-cyan-950/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-cyan-300">Cane Testing Service</h3>
            </div>
            <p className="text-[11px] text-cyan-400/80 leading-relaxed">
              CTS operates <span className="font-semibold text-cyan-300">11 laboratories</span> (9 KZN, 2 Mpumalanga)
              providing independent cane quality testing using Direct Analysis of Cane (DAC).
              Determines Recoverable Value (RV) for accurate grower-miller payments — the foundation
              of fair cane pricing across the industry.
            </p>
          </div>

          {/* Quick Mill List */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">All Mills</h3>
            <div className="space-y-1.5">
              {mills.map((mill) => {
                const isTongaat = tongaatMillIds.has(mill.id)
                return (
                  <div
                    key={mill.id}
                    className={cn(
                      'flex items-center justify-between rounded-md px-2 py-1.5 text-xs',
                      'hover:bg-slate-700/50 transition-colors cursor-pointer',
                      isTongaat && mill.status === 'operating' && 'border border-red-800/40 bg-red-950/20 hover:bg-red-950/30',
                    )}
                    onClick={() => {
                      map.current?.flyTo({
                        center: [mill.lng, mill.lat],
                        zoom: 10,
                        duration: 1500,
                      })
                      const marker = millMarkers.current[mill.id]
                      if (marker) {
                        // Open popup after fly animation completes
                        setTimeout(() => {
                          if (!marker.getPopup().isOpen()) {
                            marker.togglePopup()
                          }
                        }, 1600)
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: isTongaat && mill.status === 'operating' ? '#f59e0b' : statusColors[mill.status],
                          border: isTongaat ? '1.5px solid #ef4444' : 'none',
                          boxShadow: isTongaat && mill.status === 'operating' ? '0 0 4px rgba(239,68,68,0.5)' : 'none',
                        }}
                      />
                      <span className={cn('text-slate-300', isTongaat && 'text-orange-200')}>{mill.name}</span>
                    </div>
                    <span className={cn(
                      'text-[10px]',
                      isTongaat ? 'text-red-400 font-medium' : 'text-slate-500',
                    )}>
                      {isTongaat ? 'Tongaat' : mill.company.split(' ')[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPanel>
  )
}
