/*

Custom Chord generators, inspired by D3's chord layouts.
Most of the structure is similar to D3's implementations. All rights belong to them!

*/

var chord = function (d, i) {
    
    var angle = Math.atan((d.target.py-d.source.py)/(d.target.px-d.source.px));
   
    var s = subgroup(d.source, angle),
        t = subgroup(d.target, angle);
        
        if (s.r >= t.r) {
            var mid = s.mid;
        } else {
            var mid = t.mid;
        };
    
        return "M" + s.p0
        + curve(mid, s.center, t.center, s.p0, t.p0)
        + arc(-angle, t.r, t.p1)
        + curve(mid, t.center, s.center, t.p1, s.p1)
        + arc(angle, s.r, s.p0) 
        + "Z";
};

var subgroup = function (f, angle) {

    return {
      r: f.radius,
      center: [f.px, f.py],
      mid: [(f.radius/10)*Math.cos(angle - Math.PI/2), (f.radius/10)*Math.sin(angle - Math.PI/2)],
      p0: [f.px + f.radius*Math.cos(angle - Math.PI/2), f.py + f.radius*Math.sin(angle - Math.PI/2)],
      p1: [f.px + f.radius*Math.cos(angle + Math.PI/2), f.py + f.radius*Math.sin(angle + Math.PI/2)]
    };
};

var arc = function (a, r, p) {
    return "A" + r + "," + r + " " + a + " 0,1 " + p;
};

var curve = function(mid, center0, center1, p0, p1) {
    var mid = [center0[0] + (center1[0] - center0[0])/2,
                center0[1] + (center1[1] - center0[1])/2];
    return "Q " + mid + " " + p1;
};