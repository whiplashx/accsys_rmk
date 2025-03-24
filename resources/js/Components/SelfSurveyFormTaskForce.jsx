"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import html2pdf from "html2pdf.js"

const SelfSurveyForm = ({ areas = [] }) => {
  const [loading, setLoading] = useState(false)
  const [selectedArea, setSelectedArea] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const parametersPerPage = 2
  const [error, setError] = useState(null)
  
  // New state for export functionality
  const [selectedAreasForExport, setSelectedAreasForExport] = useState({})
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [exportTitle, setExportTitle] = useState("")
  const [exportSubtitle, setExportSubtitle] = useState("")
  const [includeRatingScale, setIncludeRatingScale] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)

  // Set selected area when areas change
  useEffect(() => {
    if (areas.length > 0) {
      setSelectedArea(areas[0])
    }
  }, [areas])

  useEffect(() => {
    // Initialize selected areas for export when areas are loaded
    if (areas.length > 0) {
      const initialSelectedAreas = {}
      areas.forEach((area) => {
        initialSelectedAreas[area.id] = true
      })
      setSelectedAreasForExport(initialSelectedAreas)
    }
  }, [areas])

  // Remove fetchAreas and fetchPrograms functions

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const ratingScale = [
    { value: "NA", label: "Not Applicable", description: "-" },
    { value: "0", label: "Missing", description: "-" },
    {
      value: "1",
      label: "Poor",
      description:
        "Criterion is met minimally in some respects, but much improvement is needed to overcome weaknesses (<50% lesser than the standards)",
    },
    {
      value: "2",
      label: "Fair",
      description:
        "Criterion is met in most respects, but some improvement is needed to overcome weaknesses (<50% lesser than the standards)",
    },
    {
      value: "3",
      label: "Satisfactory",
      description: "Criterion is met in all respects (100% compliance with the standards)",
    },
    {
      value: "4",
      label: "Very Satisfactory",
      description:
        "Criterion is fully met in all respects at a level that demonstrates good practice (>50% greater than the standards)",
    },
    {
      value: "5",
      label: "Excellent",
      description:
        "Criterion is fully met with substantial number of good practices, at a level that provides a model for others (>75% greater than the standards)",
    },
  ]

  const handleViewDocument = (documentId, indicator) => {
    try {
      console.log("Opening document with ID:", documentId)
      console.log("Indicator data:", indicator)

      if (!documentId) {
        console.error("Document ID is missing")
        toast.error("Document ID is missing")
        return
      }

      const uploader = indicator?.task?.assignee_name || "Unknown"
      const selfRating = indicator?.task?.selfsurvey_rating || "Not rated"

      let ratingLabel = selfRating
      if (selfRating && selfRating !== "Not rated") {
        const ratingInfo = ratingScale.find((r) => r.value === String(selfRating))
        if (ratingInfo) {
          ratingLabel = `${selfRating} - ${ratingInfo.label}`
        }
      }

      const url =
        `/document-viewer?id=${encodeURIComponent(documentId)}` +
        `&secure=true` +
        `&taskName=${encodeURIComponent(indicator?.description || "Document")}` +
        `&uploader=${encodeURIComponent(uploader)}` +
        `&rating=${encodeURIComponent(ratingLabel)}`

      console.log("Document viewer URL:", url)
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (e) {
      console.error("Error opening document viewer:", e)
      toast.error("Failed to open document viewer")
    }
  }

  const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
    return roman[num - 1] || num
  }

  const toLetter = (num) => String.fromCharCode(64 + num)

  const renderRatingScale = () => (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-slate-700">Rating Scale</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              {ratingScale.map(({ value, label }) => (
                <th key={value} className="border border-slate-300 p-2 text-center">
                  <span className="text-lg font-semibold text-slate-700">{value}</span>
                  <br />
                  <span className="text-sm text-slate-600">{label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {ratingScale.map(({ value, description }) => (
                <td key={value} className="border border-slate-300 p-2 text-sm text-slate-600">
                  {description}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  const isValidDocument = (docId) => {
    return !!docId && docId !== "" && docId !== 0
  }

  // Toggle area selection for export
  const toggleAreaForExport = (areaId) => {
    setSelectedAreasForExport((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }))
  }

  // Select/deselect all areas
  const toggleAllAreasForExport = (selectAll) => {
    const newSelection = {}
    areas.forEach((area) => {
      newSelection[area.id] = selectAll
    })
    setSelectedAreasForExport(newSelection)
  }

  // Enhanced export to PDF functionality
  const exportToPDF = () => {
    try {
      setExportLoading(true)
      const loadingToast = toast.info("Preparing PDF export...", { autoClose: false })

      // Create a new div for the export content
      const exportContainer = document.createElement("div")
      exportContainer.style.fontFamily = "Arial, sans-serif"
      exportContainer.style.padding = "20px"

      // Add header with logo and title
      const header = document.createElement("div")
      header.style.textAlign = "center"
      header.style.marginBottom = "30px"

      // Add title and subtitle
      const titleElement = document.createElement("h1")
      titleElement.style.fontSize = "24px"
      titleElement.style.fontWeight = "bold"
      titleElement.style.marginBottom = "5px"
      titleElement.style.color = "#1e293b"
      titleElement.textContent = exportTitle || "Self-Survey Assessment Report"
      header.appendChild(titleElement)

      if (exportSubtitle) {
        const subtitleElement = document.createElement("h2")
        subtitleElement.style.fontSize = "18px"
        subtitleElement.style.fontWeight = "normal"
        subtitleElement.style.marginBottom = "20px"
        subtitleElement.style.color = "#475569"
        subtitleElement.textContent = exportSubtitle
        header.appendChild(subtitleElement)
      }

      // Add date
      const dateElement = document.createElement("p")
      dateElement.style.fontSize = "14px"
      dateElement.style.color = "#64748b"
      dateElement.textContent = `Generated on: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`
      header.appendChild(dateElement)

      exportContainer.appendChild(header)

      // Add rating scale if selected
      if (includeRatingScale) {
        const ratingScaleTitle = document.createElement("h2")
        ratingScaleTitle.style.fontSize = "20px"
        ratingScaleTitle.style.fontWeight = "bold"
        ratingScaleTitle.style.marginTop = "20px"
        ratingScaleTitle.style.marginBottom = "10px"
        ratingScaleTitle.style.color = "#1e293b"
        ratingScaleTitle.textContent = "Rating Scale"
        exportContainer.appendChild(ratingScaleTitle)

        const ratingTable = document.createElement("table")
        ratingTable.style.width = "100%"
        ratingTable.style.borderCollapse = "collapse"
        ratingTable.style.marginBottom = "30px"

        // Create header row
        const thead = document.createElement("thead")
        const headerRow = document.createElement("tr")
        headerRow.style.backgroundColor = "#f1f5f9"

        ratingScale.forEach(({ value, label }) => {
          const th = document.createElement("th")
          th.style.border = "1px solid #cbd5e1"
          th.style.padding = "8px"
          th.style.textAlign = "center"

          const valueSpan = document.createElement("span")
          valueSpan.style.fontSize = "16px"
          valueSpan.style.fontWeight = "bold"
          valueSpan.textContent = value
          th.appendChild(valueSpan)

          th.appendChild(document.createElement("br"))

          const labelSpan = document.createElement("span")
          labelSpan.style.fontSize = "14px"
          labelSpan.textContent = label
          th.appendChild(labelSpan)

          headerRow.appendChild(th)
        })

        thead.appendChild(headerRow)
        ratingTable.appendChild(thead)

        // Create description row
        const tbody = document.createElement("tbody")
        const descRow = document.createElement("tr")

        ratingScale.forEach(({ value, description }) => {
          const td = document.createElement("td")
          td.style.border = "1px solid #cbd5e1"
          td.style.padding = "8px"
          td.style.fontSize = "12px"
          td.textContent = description
          descRow.appendChild(td)
        })

        tbody.appendChild(descRow)
        ratingTable.appendChild(tbody)
        exportContainer.appendChild(ratingTable)
      }

      // Add selected areas
      const selectedAreas = areas.filter((area) => selectedAreasForExport[area.id])

      selectedAreas.forEach((area, areaIndex) => {
        const areaTitle = document.createElement("h2")
        areaTitle.style.fontSize = "20px"
        areaTitle.style.fontWeight = "bold"
        areaTitle.style.marginTop = "30px"
        areaTitle.style.marginBottom = "15px"
        areaTitle.style.color = "#1e293b"
        areaTitle.style.borderBottom = "2px solid #cbd5e1"
        areaTitle.style.paddingBottom = "5px"
        areaTitle.textContent = `Area ${toRoman(areaIndex + 1)}: ${area.name}`
        exportContainer.appendChild(areaTitle)

        // Add parameters for this area
        if (area.parameters && area.parameters.length > 0) {
          area.parameters.forEach((parameter, paramIndex) => {
            const paramTitle = document.createElement("h3")
            paramTitle.style.fontSize = "18px"
            paramTitle.style.fontWeight = "semibold"
            paramTitle.style.marginTop = "20px"
            paramTitle.style.marginBottom = "10px"
            paramTitle.style.color = "#334155"
            paramTitle.textContent = `Parameter ${toLetter(paramIndex + 1)}: ${parameter.name}`
            exportContainer.appendChild(paramTitle)

            // Create table for indicators
            if (parameter.indicators && parameter.indicators.length > 0) {
              const table = document.createElement("table")
              table.style.width = "100%"
              table.style.borderCollapse = "collapse"
              table.style.marginBottom = "20px"

              // Table header
              const tableHead = document.createElement("thead")
              const headerRow = document.createElement("tr")
              headerRow.style.backgroundColor = "#f1f5f9"

              const thIndicator = document.createElement("th")
              thIndicator.style.border = "1px solid #cbd5e1"
              thIndicator.style.padding = "8px"
              thIndicator.style.textAlign = "left"
              thIndicator.textContent = "Indicator"
              headerRow.appendChild(thIndicator)

              const thRating = document.createElement("th")
              thRating.style.border = "1px solid #cbd5e1"
              thRating.style.padding = "8px"
              thRating.style.textAlign = "center"
              thRating.style.width = "120px"
              thRating.textContent = "Rating"
              headerRow.appendChild(thRating)

              const thDocument = document.createElement("th")
              thDocument.style.border = "1px solid #cbd5e1"
              thDocument.style.padding = "8px"
              thDocument.style.textAlign = "center"
              thDocument.style.width = "120px"
              thDocument.textContent = "Document Status"
              headerRow.appendChild(thDocument)

              tableHead.appendChild(headerRow)
              table.appendChild(tableHead)

              // Table body
              const tableBody = document.createElement("tbody")

              parameter.indicators.forEach((indicator, indIndex) => {
                const row = document.createElement("tr")
                row.style.backgroundColor = indIndex % 2 === 0 ? "#ffffff" : "#f8fafc"

                const tdIndicator = document.createElement("td")
                tdIndicator.style.border = "1px solid #cbd5e1"
                tdIndicator.style.padding = "8px"
                tdIndicator.textContent = indicator.description
                row.appendChild(tdIndicator)

                const tdRating = document.createElement("td")
                tdRating.style.border = "1px solid #cbd5e1"
                tdRating.style.padding = "8px"
                tdRating.style.textAlign = "center"

                if (indicator.task?.selfsurvey_rating) {
                  const ratingInfo = ratingScale.find(({ value }) => value === String(indicator.task.selfsurvey_rating))
                  tdRating.textContent = `${indicator.task.selfsurvey_rating} - ${ratingInfo?.label || ""}`
                  tdRating.style.fontWeight = "bold"
                } else {
                  tdRating.textContent = "No Rating"
                  tdRating.style.fontStyle = "italic"
                  tdRating.style.color = "#94a3b8"
                }
                row.appendChild(tdRating)

                const tdDocument = document.createElement("td")
                tdDocument.style.border = "1px solid #cbd5e1"
                tdDocument.style.padding = "8px"
                tdDocument.style.textAlign = "center"

                if (isValidDocument(indicator.documents)) {
                  tdDocument.textContent = "Document Available"
                  tdDocument.style.color = "#059669"
                } else {
                  tdDocument.textContent = "No Document"
                  tdDocument.style.color = "#94a3b8"
                }
                row.appendChild(tdDocument)

                tableBody.appendChild(row)
              })

              table.appendChild(tableBody)
              exportContainer.appendChild(table)
            } else {
              const noIndicators = document.createElement("p")
              noIndicators.style.textAlign = "center"
              noIndicators.style.padding = "10px"
              noIndicators.style.color = "#64748b"
              noIndicators.textContent = "No indicators found for this parameter."
              exportContainer.appendChild(noIndicators)
            }
          })
        } else {
          const noParameters = document.createElement("p")
          noParameters.style.textAlign = "center"
          noParameters.style.padding = "10px"
          noParameters.style.color = "#64748b"
          noParameters.textContent = "No parameters found for this area."
          exportContainer.appendChild(noParameters)
        }
      })

      // Add footer
      const footer = document.createElement("div")
      footer.style.marginTop = "30px"
      footer.style.borderTop = "1px solid #cbd5e1"
      footer.style.paddingTop = "10px"
      footer.style.textAlign = "center"
      footer.style.fontSize = "12px"
      footer.style.color = "#64748b"
      footer.textContent = "This is an official self-survey assessment document."
      exportContainer.appendChild(footer)

      // Configure PDF options
      const options = {
        margin: [15, 15, 15, 15],
        filename: `${exportTitle || "Self-Survey-Form"}-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }

      // Generate PDF
      html2pdf()
        .from(exportContainer)
        .set(options)
        .save()
        .then(() => {
          toast.dismiss(loadingToast)
          toast.success("PDF exported successfully!")
          setExportLoading(false)
          setShowExportOptions(false)
        })
        .catch((err) => {
          toast.dismiss(loadingToast)
          console.error("Error exporting PDF:", err)
          toast.error("Failed to export PDF")
          setExportLoading(false)
        })
    } catch (err) {
      console.error("Error in PDF export:", err)
      toast.error("Failed to export PDF")
      setExportLoading(false)
    }
  }

  // Remove handleProgramChange function and handleRetry function

  const renderParameters = (parameters = [], startIndex) => {
    if (!parameters || parameters.length === 0) {
      return <div className="p-4 text-center text-gray-600">No parameters found for this area.</div>
    }

    return (
      <div>
        {parameters.map((parameter, paramIndex) => {
          return (
            <div key={parameter.id} className="mb-8 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-slate-700">
                Parameter {toLetter(startIndex + paramIndex + 1)}: {parameter.name}
              </h3>

              {!parameter.indicators || parameter.indicators.length === 0 ? (
                <div className="p-4 text-center text-gray-600">No indicators found for this parameter.</div>
              ) : (
                <table className="w-full border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2 text-left text-slate-700">Indicator</th>
                      <th className="border border-slate-300 p-2 text-center w-32 text-slate-700">Rating</th>
                      <th className="border border-slate-300 p-2 text-center w-32 text-slate-700">Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameter.indicators.map((indicator, indIndex) => {
                      const hasDocument = isValidDocument(indicator.documents)

                      return (
                        <tr key={indicator.id} className="even:bg-slate-50">
                          <td className="border border-slate-300 p-2 text-slate-600">{indicator.description}</td>
                          <td className="border border-slate-300 p-2 text-center">
                            {indicator.task?.selfsurvey_rating ? (
                              <span className="text-slate-700 font-semibold">
                                {indicator.task.selfsurvey_rating} -{" "}
                                {ratingScale.find(({ value }) => value === String(indicator.task.selfsurvey_rating))
                                  ?.label || "No Label"}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">No Rating</span>
                            )}
                          </td>

                          <td className="border border-slate-300 p-2 text-slate-600 text-center">
                            {hasDocument ? (
                              <div className="flex justify-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewDocument(indicator.documents, indicator)
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-all duration-200 ease-in-out shadow-sm hover:shadow-md group transform hover:scale-105"
                                >
                                  <svg
                                    className="w-4 h-4 mr-1.5 transition-all group-hover:text-blue-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  <span className="group-hover:underline">View</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                  <svg
                                    className="w-3.5 h-3.5 mr-1 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                    />
                                  </svg>
                                  No Document
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderPagination = () => {
    if (!selectedArea?.parameters?.length) return null

    const pageCount = Math.ceil(selectedArea.parameters.length / parametersPerPage)
    return (
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="bg-slate-500 text-white px-4 py-2 rounded disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors hover:bg-slate-600"
        >
          Previous
        </button>
        <span className="text-slate-600">
          Page {currentPage + 1} of {pageCount}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))}
          disabled={currentPage === pageCount - 1}
          className="bg-slate-500 text-white px-4 py-2 rounded disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors hover:bg-slate-600"
        >
          Next
        </button>
      </div>
    )
  }

  const renderAreaButtons = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {areas.map((area, index) => (
        <button
          key={area.id}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedArea?.id === area.id ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
          onClick={() => {
            setSelectedArea(area)
            setCurrentPage(0)
          }}
        >
          Area {toRoman(index + 1)}
        </button>
      ))}
    </div>
  )

  // Add the missing renderExportOptions function
  const renderExportOptions = () => {
    if (!showExportOptions) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Export Options</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                value={exportTitle}
                onChange={(e) => setExportTitle(e.target.value)}
                placeholder="Self-Survey Assessment Report"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Subtitle (Optional)</label>
              <input
                type="text"
                value={exportSubtitle}
                onChange={(e) => setExportSubtitle(e.target.value)}
                placeholder="e.g., Department or Institution Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Select Areas to Include</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAllAreasForExport(true)}
                    className="text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAllAreasForExport(false)}
                    className="text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-300 rounded-md p-2">
                {areas.map((area, index) => (
                  <div key={area.id} className="flex items-center mb-2 last:mb-0">
                    <input
                      type="checkbox"
                      id={`area-${area.id}`}
                      checked={selectedAreasForExport[area.id] || false}
                      onChange={() => toggleAreaForExport(area.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label htmlFor={`area-${area.id}`} className="ml-2 block text-sm text-slate-700">
                      Area {toRoman(index + 1)}: {area.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="include-rating-scale"
                checked={includeRatingScale}
                onChange={(e) => setIncludeRatingScale(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="include-rating-scale" className="ml-2 block text-sm text-slate-700">
                Include Rating Scale in Export
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowExportOptions(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition-colors"
              disabled={exportLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded max-w-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button onClick={() => setError(null)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 min-h-screen pt-20">
      <ToastContainer />
      {renderExportOptions()}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Self-Survey Form</h1>
          <button
            onClick={() => setShowExportOptions(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-150 ease-in-out shadow-sm"
            disabled={areas.length === 0}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Document
          </button>
        </div>

        {/* Remove Program Selection Dropdown */}

        {areas.length > 0 ? (
          <>
            {renderAreaButtons()}

            <div id="survey-form-content" className="space-y-8">
              {renderRatingScale()}

              {selectedArea && (
                <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-6 text-slate-700 border-b pb-2">
                    Area {toRoman(areas.findIndex((a) => a.id === selectedArea.id) + 1)}: {selectedArea.name}
                  </h2>

                  {renderParameters(
                    selectedArea.parameters?.slice(
                      currentPage * parametersPerPage,
                      (currentPage + 1) * parametersPerPage,
                    ) || [],
                    currentPage * parametersPerPage,
                  )}

                  {renderPagination()}
                </div>
              )}
            </div>
          </>
        ) : !loading && (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          
            <svg 
              className="w-16 h-16 text-slate-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No areas found for your program</h3>
            <p className="text-slate-600">
              Please contact your administrator to set up areas for your program.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SelfSurveyForm

