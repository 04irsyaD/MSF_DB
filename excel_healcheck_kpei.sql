Sub SummarizeMultipleServersWithStatusSeparated()
    Dim ws As Worksheet, wsOut As Worksheet
    Dim outputRow As Long, currentRow As Long, serverCount As Long
    Dim server As String, cpu As String, memFree As String, memStatus As String
    Dim threadUsed As String
    Dim diskPath As String, diskStatus As String
    Dim homeDiskUsage As String, homeDiskStatus As String
    Dim dataDiskUsage As String, dataDiskStatus As String
    Dim logDiskUsage As String, logDiskStatus As String
    Dim appDiskUsage As String, appDiskStatus As String
    Dim bootDiskUsage As String, bootDiskStatus As String
    Dim optDiskUsage As String, optDiskStatus As String
    Dim tmpDiskUsage As String, tmpDiskStatus As String
    Dim usrDiskUsage As String, usrDiskStatus As String
    Dim varDiskUsage As String, varDiskStatus As String
    Dim i As Long
    
    Set ws = ActiveSheet
    Set wsOut = Sheets("Sheet2")
    
    ' Clear and setup output sheet with more disk categories
    wsOut.Cells.ClearContents
    wsOut.Range("A1:Q1").Value = Array("Server", "Average CPU", "Memory Free", "Memory Status", "Thread Used", _
                                      "/home Usage", "/home Status", "/data Usage", "/data Status", _
                                      "/log Usage", "/log Status", "/app Usage", "/app Status", _
                                      "/boot Usage", "/boot Status", "/opt Usage", "/opt Status")
    
    ' Format headers
    With wsOut.Range("A1:Q1")
        .Font.Bold = True
        .Interior.Color = RGB(200, 200, 200)
        .Borders.LineStyle = xlContinuous
    End With
    
    outputRow = 2
    currentRow = 2  ' Start from row 2 (skip header)
    serverCount = 0
    
    ' Find all servers by scanning column A
    Do While currentRow <= ws.Cells(ws.Rows.Count, 1).End(xlUp).row
        server = Trim(ws.Cells(currentRow, 1).Value & "")
        
        ' Skip empty cells or header row
        If server = "" Or server = "Server" Then
            currentRow = currentRow + 1
            GoTo NextIteration
        End If
        
        ' Found a server, now get its info
        cpu = Trim(ws.Cells(currentRow, 2).Value & "")
        memFree = Trim(ws.Cells(currentRow, 3).Value & "")
        memStatus = Trim(ws.Cells(currentRow, 4).Value & "")
        threadUsed = Trim(ws.Cells(currentRow, 12).Value & "")
        
        Debug.Print "Processing Server: " & server & " at row " & currentRow
        
        ' Initialize all disk variables
        homeDiskUsage = "": homeDiskStatus = ""
        dataDiskUsage = "": dataDiskStatus = ""
        logDiskUsage = "": logDiskStatus = ""
        appDiskUsage = "": appDiskStatus = ""
        bootDiskUsage = "": bootDiskStatus = ""
        optDiskUsage = "": optDiskStatus = ""
        tmpDiskUsage = "": tmpDiskStatus = ""
        usrDiskUsage = "": usrDiskStatus = ""
        varDiskUsage = "": varDiskStatus = ""
        
        ' Collect disk data for this server (check next 14 rows or until next server)
        Dim endRow As Long
        endRow = currentRow + 14  ' Check up to 14 rows ahead
        
        ' Check if there's another server within the next 14 rows
        For i = currentRow + 1 To endRow
            If i > ws.Cells(ws.Rows.Count, 1).End(xlUp).row Then
                endRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).row
                Exit For
            End If
            
            Dim nextServerCheck As String
            nextServerCheck = Trim(ws.Cells(i, 1).Value & "")
            If nextServerCheck <> "" And nextServerCheck <> server Then
                ' Found next server, adjust endRow
                endRow = i - 1
                Exit For
            End If
        Next i
        
        ' Collect disk data from currentRow to endRow
        For i = currentRow To endRow
            diskPath = Trim(ws.Cells(i, 5).Value & "")      ' Column E - Disk Used
            diskStatus = Trim(ws.Cells(i, 6).Value & "")    ' Column F - Status
            
            If diskPath <> "" And diskPath <> "Disk Used" Then
                Debug.Print "  Found disk: " & diskPath & " | Status: " & diskStatus
                
                ' Categorize disks by path
                If InStr(diskPath, "/home") > 0 Then
                    If homeDiskUsage <> "" Then homeDiskUsage = homeDiskUsage & ", ": homeDiskStatus = homeDiskStatus & ", "
                    homeDiskUsage = homeDiskUsage & diskPath: homeDiskStatus = homeDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/data") > 0 Then
                    If dataDiskUsage <> "" Then dataDiskUsage = dataDiskUsage & ", ": dataDiskStatus = dataDiskStatus & ", "
                    dataDiskUsage = dataDiskUsage & diskPath: dataDiskStatus = dataDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/log") > 0 Then
                    If logDiskUsage <> "" Then logDiskUsage = logDiskUsage & ", ": logDiskStatus = logDiskStatus & ", "
                    logDiskUsage = logDiskUsage & diskPath: logDiskStatus = logDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/app") > 0 Then
                    If appDiskUsage <> "" Then appDiskUsage = appDiskUsage & ", ": appDiskStatus = appDiskStatus & ", "
                    appDiskUsage = appDiskUsage & diskPath: appDiskStatus = appDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/boot") > 0 Then
                    If bootDiskUsage <> "" Then bootDiskUsage = bootDiskUsage & ", ": bootDiskStatus = bootDiskStatus & ", "
                    bootDiskUsage = bootDiskUsage & diskPath: bootDiskStatus = bootDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/opt") > 0 Then
                    If optDiskUsage <> "" Then optDiskUsage = optDiskUsage & ", ": optDiskStatus = optDiskStatus & ", "
                    optDiskUsage = optDiskUsage & diskPath: optDiskStatus = optDiskStatus & diskStatus
                End If
            End If
        Next i
        
        ' Write server summary to output sheet
        wsOut.Cells(outputRow, 1).Value = server
        wsOut.Cells(outputRow, 2).Value = cpu
        wsOut.Cells(outputRow, 3).Value = memFree
        wsOut.Cells(outputRow, 4).Value = memStatus
        wsOut.Cells(outputRow, 5).Value = threadUsed
        wsOut.Cells(outputRow, 6).Value = homeDiskUsage
        wsOut.Cells(outputRow, 7).Value = homeDiskStatus
        wsOut.Cells(outputRow, 8).Value = dataDiskUsage
        wsOut.Cells(outputRow, 9).Value = dataDiskStatus
        wsOut.Cells(outputRow, 10).Value = logDiskUsage
        wsOut.Cells(outputRow, 11).Value = logDiskStatus
        wsOut.Cells(outputRow, 12).Value = appDiskUsage
        wsOut.Cells(outputRow, 13).Value = appDiskStatus
        wsOut.Cells(outputRow, 14).Value = bootDiskUsage
        wsOut.Cells(outputRow, 15).Value = bootDiskStatus
        wsOut.Cells(outputRow, 16).Value = optDiskUsage
        wsOut.Cells(outputRow, 17).Value = optDiskStatus
        
        ' Add color coding (now defined below)
        Call ColorCodeDiskUsageAndStatus(wsOut, outputRow)
        
        outputRow = outputRow + 1
        serverCount = serverCount + 1
        
        ' Move to next server row
        ' Check if next server is exactly 14 rows ahead (standard pattern)
        Dim nextServerRow As Long
        nextServerRow = currentRow + 14
        
        ' Verify if there's actually a server at that position
        If nextServerRow <= ws.Cells(ws.Rows.Count, 1).End(xlUp).row Then
            Dim nextServerName As String
            nextServerName = Trim(ws.Cells(nextServerRow, 1).Value & "")
            If nextServerName <> "" And nextServerName <> server Then
                currentRow = nextServerRow
            Else
                ' Look for next server manually
                currentRow = endRow + 1
                Do While currentRow <= ws.Cells(ws.Rows.Count, 1).End(xlUp).row
                    If Trim(ws.Cells(currentRow, 1).Value & "") <> "" Then
                        Exit Do
                    End If
                    currentRow = currentRow + 1
                Loop
            End If
        Else
            currentRow = endRow + 1
        End If
        
        Debug.Print "Completed server: " & server & ", moving to row: " & currentRow
        
NextIteration:
        ' Safety check to prevent infinite loop
        If currentRow > ws.Cells(ws.Rows.Count, 1).End(xlUp).row Or serverCount > 100 Then Exit Do
    Loop
    
    ' Format output
    With wsOut.Range("A2:Q" & outputRow - 1)
        .Borders.LineStyle = xlContinuous
    End With
    
    ' Auto-fit columns
    wsOut.Columns("A:Q").AutoFit
    
    MsgBox serverCount & " server berhasil diproses dengan kolom Usage dan Status terpisah!"
End Sub

' Alternative simpler approach - assume fixed 14-row pattern
Sub SummarizeServersFixed14RowPattern()
    Dim ws As Worksheet, wsOut As Worksheet
    Dim outputRow As Long, currentRow As Long, serverCount As Long
    Dim server As String, cpu As String, memFree As String, memStatus As String
    Dim threadUsed As String
    Dim diskPath As String, diskStatus As String
    Dim homeDiskUsage As String, homeDiskStatus As String
    Dim dataDiskUsage As String, dataDiskStatus As String
    Dim logDiskUsage As String, logDiskStatus As String
    Dim appDiskUsage As String, appDiskStatus As String
    Dim bootDiskUsage As String, bootDiskStatus As String
    Dim optDiskUsage As String, optDiskStatus As String
    Dim i As Long
    
    Set ws = ActiveSheet
    Set wsOut = Sheets("Sheet2")
    
    ' Clear and setup output sheet
    wsOut.Cells.ClearContents
    wsOut.Range("A1:Q1").Value = Array("Server", "Average CPU", "Memory Free", "Memory Status", "Thread Used", _
                                      "/home Usage", "/home Status", "/data Usage", "/data Status", _
                                      "/log Usage", "/log Status", "/app Usage", "/app Status", _
                                      "/boot Usage", "/boot Status", "/opt Usage", "/opt Status")
    
    ' Format headers
    With wsOut.Range("A1:Q1")
        .Font.Bold = True
        .Interior.Color = RGB(200, 200, 200)
        .Borders.LineStyle = xlContinuous
    End With
    
    outputRow = 2
    currentRow = 2  ' Start from row 2
    serverCount = 0
    
    ' Process servers assuming each server has exactly 14 rows of data
    Do While currentRow <= ws.Cells(ws.Rows.Count, 1).End(xlUp).row
        server = Trim(ws.Cells(currentRow, 1).Value & "")
        
        ' Skip if empty
        If server = "" Then
            currentRow = currentRow + 14  ' Jump to next potential server row
            GoTo NextIteration
        End If
        
        ' Get server basic info
        cpu = Trim(ws.Cells(currentRow, 2).Value & "")
        memFree = Trim(ws.Cells(currentRow, 3).Value & "")
        memStatus = Trim(ws.Cells(currentRow, 4).Value & "")
        threadUsed = ""
        
        Debug.Print "Processing Server: " & server & " at row " & currentRow & " (fixed 14-row pattern)"
        
        ' Initialize disk variables
        homeDiskUsage = "": homeDiskStatus = ""
        dataDiskUsage = "": dataDiskStatus = ""
        logDiskUsage = "": logDiskStatus = ""
        appDiskUsage = "": appDiskStatus = ""
        bootDiskUsage = "": bootDiskStatus = ""
        optDiskUsage = "": optDiskStatus = ""
        
        ' Collect disk data for exactly 14 rows starting from currentRow
        For i = currentRow To currentRow + 13
            If i > ws.Cells(ws.Rows.Count, 1).End(xlUp).row Then Exit For
            
            diskPath = Trim(ws.Cells(i, 5).Value & "")
            diskStatus = Trim(ws.Cells(i, 6).Value & "")
            
            If diskPath <> "" And diskPath <> "Disk Used" Then
                Debug.Print "  Row " & i & ": " & diskPath & " | " & diskStatus
                
                ' Categorize disks
                If InStr(diskPath, "/home") > 0 Then
                    If homeDiskUsage <> "" Then homeDiskUsage = homeDiskUsage & ", ": homeDiskStatus = homeDiskStatus & ", "
                    homeDiskUsage = homeDiskUsage & diskPath: homeDiskStatus = homeDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/data") > 0 Then
                    If dataDiskUsage <> "" Then dataDiskUsage = dataDiskUsage & ", ": dataDiskStatus = dataDiskStatus & ", "
                    dataDiskUsage = dataDiskUsage & diskPath: dataDiskStatus = dataDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/log") > 0 Then
                    If logDiskUsage <> "" Then logDiskUsage = logDiskUsage & ", ": logDiskStatus = logDiskStatus & ", "
                    logDiskUsage = logDiskUsage & diskPath: logDiskStatus = logDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/app") > 0 Then
                    If appDiskUsage <> "" Then appDiskUsage = appDiskUsage & ", ": appDiskStatus = appDiskStatus & ", "
                    appDiskUsage = appDiskUsage & diskPath: appDiskStatus = appDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/boot") > 0 Then
                    If bootDiskUsage <> "" Then bootDiskUsage = bootDiskUsage & ", ": bootDiskStatus = bootDiskStatus & ", "
                    bootDiskUsage = bootDiskUsage & diskPath: bootDiskStatus = bootDiskStatus & diskStatus
                ElseIf InStr(diskPath, "/opt") > 0 Then
                    If optDiskUsage <> "" Then optDiskUsage = optDiskUsage & ", ": optDiskStatus = optDiskStatus & ", "
                    optDiskUsage = optDiskUsage & diskPath: optDiskStatus = optDiskStatus & diskStatus
                End If
            End If
        Next i
        
        ' Write to output
        wsOut.Cells(outputRow, 1).Value = server
        wsOut.Cells(outputRow, 2).Value = cpu
        wsOut.Cells(outputRow, 3).Value = memFree
        wsOut.Cells(outputRow, 4).Value = memStatus
        wsOut.Cells(outputRow, 5).Value = threadUsed
        wsOut.Cells(outputRow, 6).Value = homeDiskUsage
        wsOut.Cells(outputRow, 7).Value = homeDiskStatus
        wsOut.Cells(outputRow, 8).Value = dataDiskUsage
        wsOut.Cells(outputRow, 9).Value = dataDiskStatus
        wsOut.Cells(outputRow, 10).Value = logDiskUsage
        wsOut.Cells(outputRow, 11).Value = logDiskStatus
        wsOut.Cells(outputRow, 12).Value = appDiskUsage
        wsOut.Cells(outputRow, 13).Value = appDiskStatus
        wsOut.Cells(outputRow, 14).Value = bootDiskUsage
        wsOut.Cells(outputRow, 15).Value = bootDiskStatus
        wsOut.Cells(outputRow, 16).Value = optDiskUsage
        wsOut.Cells(outputRow, 17).Value = optDiskStatus
        
        Call ColorCodeDiskUsageAndStatus(wsOut, outputRow)
        
        outputRow = outputRow + 1
        serverCount = serverCount + 1
        
        ' Move to next server (jump exactly 14 rows)
        currentRow = currentRow + 14
        
        Debug.Print "Completed server: " & server & ", next server expected at row: " & currentRow
        
NextIteration:
        ' Safety check
        If serverCount > 100 Then Exit Do
    Loop
    
    ' Format output
    With wsOut.Range("A2:Q" & outputRow - 1)
        .Borders.LineStyle = xlContinuous
    End With
    
    wsOut.Columns("A:Q").AutoFit
    
    MsgBox serverCount & " server berhasil diproses dengan pola 14-row tetap!"
End Sub

' Missing subroutine that was causing the error - Color coding for disk usage and status
Sub ColorCodeDiskUsageAndStatus(ws As Worksheet, row As Long)
    Dim col As Long
    Dim cellValue As String
    Dim usageValue As Double
    
    ' Color code disk usage columns (6, 8, 10, 12, 14, 16 = Usage columns)
    ' Color code disk status columns (7, 9, 11, 13, 15, 17 = Status columns)
    
    For col = 6 To 17 Step 2  ' Usage columns: 6, 8, 10, 12, 14, 16
        cellValue = Trim(ws.Cells(row, col).Value & "")
        If cellValue <> "" Then
            ' Try to extract percentage from usage string
            If InStr(cellValue, "%") > 0 Then
                Dim percentPos As Long
                percentPos = InStr(cellValue, "%")
                Dim numStr As String
                numStr = ""
                
                ' Extract number before %
                Dim j As Long
                For j = percentPos - 1 To 1 Step -1
                    If IsNumeric(Mid(cellValue, j, 1)) Or Mid(cellValue, j, 1) = "." Then
                        numStr = Mid(cellValue, j, 1) & numStr
                    Else
                        Exit For
                    End If
                Next j
                
                If IsNumeric(numStr) Then
                    usageValue = CDbl(numStr)
                    ' Color based on usage percentage
                    If usageValue >= 90 Then
                        ws.Cells(row, col).Interior.Color = RGB(255, 0, 0)      ' Red for >= 90%
                        ws.Cells(row, col).Font.Color = RGB(255, 255, 255)     ' White text
                    ElseIf usageValue >= 80 Then
                        ws.Cells(row, col).Interior.Color = RGB(255, 165, 0)   ' Orange for >= 80%
                    ElseIf usageValue >= 70 Then
                        ws.Cells(row, col).Interior.Color = RGB(255, 255, 0)   ' Yellow for >= 70%
                    End If
                End If
            End If
        End If
    Next col
    
    ' Color code status columns (7, 9, 11, 13, 15, 17)
    For col = 7 To 17 Step 2  ' Status columns: 7, 9, 11, 13, 15, 17
        cellValue = UCase(Trim(ws.Cells(row, col).Value & ""))
        If cellValue <> "" Then
            If InStr(cellValue, "CRITICAL") > 0 Or InStr(cellValue, "ERROR") > 0 Then
                ws.Cells(row, col).Interior.Color = RGB(255, 0, 0)         ' Red for Critical/Error
                ws.Cells(row, col).Font.Color = RGB(255, 255, 255)        ' White text
            ElseIf InStr(cellValue, "WARNING") > 0 Or InStr(cellValue, "WARN") > 0 Then
                ws.Cells(row, col).Interior.Color = RGB(255, 165, 0)      ' Orange for Warning
            ElseIf InStr(cellValue, "OK") > 0 Or InStr(cellValue, "NORMAL") > 0 Or InStr(cellValue, "GOOD") > 0 Then
                ws.Cells(row, col).Interior.Color = RGB(0, 255, 0)        ' Green for OK/Normal/Good
            End If
        End If
    Next col
End Sub


