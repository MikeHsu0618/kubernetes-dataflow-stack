Memcache install:
```
helm upgrade --install memcache  oci://registry-1.docker.io/bitnamicharts/memcached -n memcache -f values.yaml --create-namespace
```


```
docker run --name memcached 
  -v ./:/disk/extstore \
  -p 11211:11211 \
  memcached:1.6.23 \
  memcached -m 600 -vvv -I 2m -o ext_path=/disk/extstore/test:1G,ext_wbuf_size=32,ext_threads=10,ext_max_sleep=10000,slab_automove_freeratio=0.10,ext_recache_rate=0
```
