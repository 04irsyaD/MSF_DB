Sub PecahDataSerialNumberFix()

    Dim wsIn As Worksheet, wsOut As Worksheet
    Dim lastRow As Long
    Dim i As Long, j As Long
    Dim kode As String
    Dim serials() As String, kondisi() As String
    Dim outRow As Long

    ' Ambil sheet input
    On Error Resume Next
    Set wsIn = ThisWorkbook.Sheets("Sheet2") ' Ganti jika sheet-nya beda
    If wsIn Is Nothing Then
        MsgBox "Sheet 'Sheet1' tidak ditemukan.", vbExclamation
        Exit Sub
    End If
    On Error GoTo 0

    ' Siapkan sheet output
    On Error Resume Next
    Set wsOut = ThisWorkbook.Sheets("Output")
    If wsOut Is Nothing Then
        Set wsOut = ThisWorkbook.Sheets.Add(After:=wsIn)
        wsOut.Name = "Output"
    Else
        wsOut.Cells.Clear
    End If
    On Error GoTo 0

    ' Header output
    wsOut.Range("A1:C1").Value = Array("code_spbu", "serial_number", "kondisi")
    outRow = 2

    ' Proses baris
    lastRow = wsIn.Cells(wsIn.Rows.Count, "A").End(xlUp).Row
    For i = 2 To lastRow
        kode = Trim(wsIn.Cells(i, 1).Value)

        ' Bersihkan karakter line-break
        Dim rawSerial As String, rawKondisi As String
        rawSerial = Replace(wsIn.Cells(i, 2).Value, vbLf, " ")
        rawKondisi = Replace(wsIn.Cells(i, 3).Value, vbLf, " ")

        If Len(Trim(rawSerial)) = 0 And Len(Trim(rawKondisi)) = 0 Then
            ' Kalau data kosong tetap tampil 1 baris
            wsOut.Cells(outRow, 1).Value = kode
            wsOut.Cells(outRow, 2).Value = ""
            wsOut.Cells(outRow, 3).Value = ""
            outRow = outRow + 1
        Else
            ' Split data
            serials = Split(rawSerial, "|")
            kondisi = Split(rawKondisi, "|")

            For j = 0 To UBound(serials)
                wsOut.Cells(outRow, 1).Value = kode
                wsOut.Cells(outRow, 2).Value = Trim(serials(j))
                If j <= UBound(kondisi) Then
                    wsOut.Cells(outRow, 3).Value = Trim(kondisi(j))
                Else
                    wsOut.Cells(outRow, 3).Value = ""
                End If
                outRow = outRow + 1
            Next j
        End If
    Next i

    MsgBox "Selesai! Data sudah diproses di sheet 'Output'.", vbInformation

End Sub
