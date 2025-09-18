create trigger tg_updategriskidentification after
insert
    on
    public.t_griskidentification for each row execute function f_griskreferences()


create trigger tg_updategrisklist after
update
    on
    public.t_griskidentification for each row execute function f_grisklistupdate()

create trigger tg_updategrisklistreferences after
update
    on
    public.t_griskidentification for each row execute function f_griskreferenceslist()

create trigger tg_insertgrisklist after
insert
    on
    public.t_griskidentification for each row execute function f_grisklist()