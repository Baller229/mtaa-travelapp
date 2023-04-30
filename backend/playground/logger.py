import os
import threading
import sys
lock = threading.Lock()

# ================================================================
# LOGGER
# ================================================================

def dbg(*args, **kwargs):
    frame_obj = sys._getframe(1)  # currentframe()  # get frame of caller function
    line = frame_obj.f_lineno  # source code line number of caller place
    code_obj = frame_obj.f_code  # source code object ( method or function object )
    file_name = code_obj.co_filename  # file name of source code object

    msg = "{0}:{1:<4};".format(file_name.rjust(64), line)
    ct = threading.current_thread()
    msg += "{0:6}; {1};".format(ct.ident, ct.name.ljust(24))
    for a in args:
        msg += "{} ".format(a)
    for k, v in reversed(kwargs.items()):
        msg += "{}={} ".format(k, v)
    with lock:
        print(msg)

# ================================================================