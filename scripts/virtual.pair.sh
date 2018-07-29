# You will see output like so

# 2018/07/29 09:43:54 socat[20004] N PTY is /dev/ttys007
# 2018/07/29 09:43:54 socat[20004] N PTY is /dev/ttys008
# 2018/07/29 09:43:54 socat[20004] N starting data transfer loop with FDs [5,5] and [7,7]

# now you will want to:
# cat /dev/ttys007 | hexdump
# now when you make an API call, you will see the hexdump

# it seems you have to make two calls to see it!
# do not be discouraged

socat -d -d pty,raw,echo=0 pty,raw,echo=0
