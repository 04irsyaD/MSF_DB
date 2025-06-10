--  //jika tidak bisa ke query 1 gunakan query 2
--/Query 1 

=IFERROR(INDEX(G$3:G$65; MATCH(I3; F$3:F$65; 0)); "")

--/Query 2

=IFERROR(INDEX(W$2:W$800, MATCH(I2, V$2:V$800, 0)), "")

