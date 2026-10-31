

<!> pasa los productos anteriores a tru para saber si esta dsiponible es desir se ve en la interfas pero no hay stok aunque alla esta pensa para comida etc nos quedamos sin esto 
docker exec -it vet_db_bel psql -U ary -d vet_core_db -c "
DO \$\$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='producto' AND column_name='prod_disponible') THEN 
        UPDATE producto SET  
            prod_stock= 0, 
            prod_activo = TRUE, 
            prod_visible = TRUE, 
            permitir_sin_stock = TRUE;
    END IF; 
END \$\$;
" 