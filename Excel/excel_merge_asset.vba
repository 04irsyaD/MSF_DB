Sub DuplicateAndFilterCodeAssetWithSingleCondition()
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim codeAssetCol As Long
    Dim conditionCol As Long
    Dim newRow As Long
    Dim codeAssets() As String
    Dim conditions() As String
    Dim delimiter As String
    Dim containsA920 As Boolean
    Dim containsOtherThanA920 As Boolean
    Dim filteredCodeAssets() As String
    Dim goodCount As Long
    Dim badCount As Long
 
    ' Set the worksheet
    Set ws = ThisWorkbook.Sheets("Sheet3") ' Ganti Sheet3 dengan nama sheet Anda
 
    ' Find the column that contains the "code_asset" header
    codeAssetCol = 0
    For i = 1 To ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column
        If ws.Cells(1, i).Value = "code_asset" Then
            codeAssetCol = i
            Exit For
        End If
    Next i
 
    ' If the "code_asset" column is not found, exit the subroutine
    If codeAssetCol = 0 Then
        MsgBox "Kolom 'code_asset' tidak ditemukan.", vbExclamation
        Exit Sub
    End If
 
    ' Find the column that contains the "kondisi_asset" header
    conditionCol = 0
    For i = 1 To ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column
        If ws.Cells(1, i).Value = "kondisi_asset" Then
            conditionCol = i
            Exit For
        End If
    Next i
 
    ' If the "kondisi_asset" column is not found, exit the subroutine
    If conditionCol = 0 Then
        MsgBox "Kolom 'kondisi_asset' tidak ditemukan.", vbExclamation
        Exit Sub
    End If
 
    ' Set the delimiter used in the code asset column
    delimiter = " | "
 
    ' Find the last row in the worksheet
    lastRow = ws.Cells(ws.Rows.Count, codeAssetCol).End(xlUp).Row
 
    ' Loop through each row from bottom to top
    For i = lastRow To 2 Step -1
        ' Initialize flags
        containsA920 = False
        containsOtherThanA920 = False
        k = 0 ' Initialize index for filteredCodeAssets array
        goodCount = 0
        badCount = 0
 
        ' Check if the code asset cell contains the delimiter "|"
        If InStr(ws.Cells(i, codeAssetCol).Value, delimiter) > 0 Then
            ' Split the code assets by the delimiter
            codeAssets = Split(ws.Cells(i, codeAssetCol).Value, delimiter)
        Else
            ' If no delimiter, process as a single value
            ReDim codeAssets(0)
            codeAssets(0) = ws.Cells(i, codeAssetCol).Value
        End If
 
        ' Filter code assets to include only "A920" and others
        For j = LBound(codeAssets) To UBound(codeAssets)
            If InStr(codeAssets(j), "A920") > 0 Then
                containsA920 = True
            Else
                containsOtherThanA920 = True
            End If
        Next j
 
        ' Filter and duplicate based on "A920"
        If containsA920 Then
            ' Create a new array to store only the code assets that contain "A920"
            ReDim filteredCodeAssets(UBound(codeAssets))
            For j = LBound(codeAssets) To UBound(codeAssets)
                If InStr(codeAssets(j), "A920") > 0 Then
                    filteredCodeAssets(k) = codeAssets(j)
                    k = k + 1
                End If
            Next j
            ' Resize the array to the actual number of elements containing "A920"
            If k > 0 Then
                ReDim Preserve filteredCodeAssets(k - 1)
                ' Update the original cell with the first filtered code asset
                ws.Cells(i, codeAssetCol).Value = filteredCodeAssets(0)
 
                ' Add new rows for the remaining filtered code assets
                For j = 1 To UBound(filteredCodeAssets)
                    newRow = i + j
                    ws.Rows(newRow).Insert Shift:=xlShiftDown
                    ws.Rows(i).Copy Destination:=ws.Rows(newRow)
                    ws.Cells(newRow, codeAssetCol).Value = filteredCodeAssets(j)
                Next j
            End If
        End If
 
        ' Manipulate the "kondisi_asset" values
        If conditionCol > 0 Then
            ' Split the conditions by "|"
            conditions = Split(ws.Cells(i, conditionCol).Value, " | ")
 
            ' Count occurrences of "Baik" and "Rusak"
            For j = LBound(conditions) To UBound(conditions)
                If Trim(conditions(j)) = "Baik" Then
                    goodCount = goodCount + 1
                ElseIf Trim(conditions(j)) = "Rusak" Then
                    badCount = badCount + 1
                End If
            Next j
 
            ' If the code asset contains exactly "A920*" (only A920 with a wildcard), set condition to "Rusak"
            If ws.Cells(i, codeAssetCol).Value Like "A920*" And Len(ws.Cells(i, codeAssetCol).Value) = 5 Then
                ws.Cells(i, conditionCol).Value = "Rusak"
            ElseIf containsA920 Then
                ' If "A920" is present with additional characters, change the entire condition to "Baik"
                ws.Cells(i, conditionCol).Value = "Baik"
            ElseIf badCount > goodCount Then
                ' If more "Rusak" than "Baik", change all to "Rusak"
                ws.Cells(i, conditionCol).Value = "Rusak"
            Else
                ' Otherwise, leave the condition as "Baik"
                ws.Cells(i, conditionCol).Value = "Baik"
            End If
        End If
 
        ' If the row does not contain "A920", delete it
        If Not containsA920 And containsOtherThanA920 Then
            ws.Rows(i).Delete
        End If
    Next i
End Sub