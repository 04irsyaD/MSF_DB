let
    Source = Excel.Workbook(File.Contents("data/pokemon.xlsx"), null, true),
    // source di gunakan untuk memanggil file yang akan di gunakan 

    Pokemon_Sheet = Source{[Item="Pokemon",Kind="Sheet"]}[Data],
    // ini akan memangguk Sheet yang berada di excel dengan nama Pokemon


    #"Promoted Headers" = Table.PromoteHeaders(Pokemon_Sheet, [PromoteAllScalars=true]),
    // Digunakan untuk merubah row pertama menjadi judul dari column 
    
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",
    {{"#", type number}, 
    {"Name", type text}, 
    {"Type", type text}, 
    {"Total", Int64.Type}, 
    {"HP", Int64.Type}, 
    {"Attack", Int64.Type}, 
    {"Defense", Int64.Type}, 
    {"Special Attack", Int64.Type}, 
    {"Special Defense", Int64.Type}, 
    {"Speed", Int64.Type}}),
    // untuk merubah tipe data dari column seperti = "text" dan "number"

    FilteredRows = Table.SelectRows(#"Changed Type", each Text.Upper ([Type]) = "POISON"),
    // untuk memfilter data dengan column dengan type poison    

    Top10 = Table.FirstN(FilteredRows, 10)
    // untuk memanggil 10 data saja

in
  // in di gunakan unutuk memanggil hasil yang sudah di deklarasikan di let  contohnya (FilteredRows, Top10)
  Top10
