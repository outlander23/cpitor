#ifdef ONPC
#include <sys/resource.h>
#pragma GCC diagnostic ignored "-Wunused-variable"
#pragma GCC diagnostic ignored "-Wrange-loop-construct"
#pragma GCC diagnostic ignored "-Wsign-compare"
#endif
#pragma GCC diagnostic ignored "-Wrange-loop-construct"
#include "bits/stdc++.h"
#include "ext/pb_ds/assoc_container.hpp"

using namespace std;
using namespace __gnu_pbds;

bool startmemory;
#define endln "\n"
#define EPSILON 1e-12
#define ll long long
#define int long long
#define uint __uint128_t
#define front_zero(n) __builtin_clzll(n)
#define back_zero(n) __builtin_ctzll(n)
#define total_one(n) __builtin_popcountll(n)

#ifdef ONPC
#include "Debug/debug.h"
#else
#define print(...) 42
#define printarr(...) 42
#endif

#define MULTI  \
    int _T;    \
    cin >> _T; \
    while (_T--)

int test_cases = 1;
const int INF = 1e18;    // infinity
const int mod = 1e9 + 7; // mod

const int base1 = 972663749; // base1
const int base2 = 998244353; // base2

const int mod1 = 1e9 + 7; // mod1
const int mod2 = 1e9 + 9; // mod2

const long double pi = 4 * atan(1);

vector<int> dx = {-1, +1, +0, +0, +1, -1, +1, -1};
vector<int> dy = {+0, +0, +1, -1, +1, -1, -1, +1};
vector<int> daysInMounth = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());

/////////////////////////////////////////////////////////////////////////////////////

template <class T>
bool ckmin(T &a, const T &b) { return b < a ? a = b, 1 : 0; }

template <class T>
bool ckmax(T &a, const T &b) { return a < b ? a = b, 1 : 0; }

template <class T>
using maxheap = priority_queue<T, vector<T>>;

template <class T>
using minheap = priority_queue<T, vector<T>, greater<T>>;

template <class T>
using ordered_set = tree<T, null_type,
                         less<T>, rb_tree_tag,
                         tree_order_statistics_node_update>;

template <class T>
constexpr T power(T a, int b)
{
    T res = 1;
    for (; b; b /= 2, a *= a)
    {
        if (b % 2)
        {
            res *= a;
        }
    }
    return res;
}

constexpr int mul(int a, int b, int p)
{
    int res = a * b - (1.L * a * b / p) * p;
    res %= p;
    if (res < 0)
    {
        res += p;
    }
    return res;
}
template <int P>
struct MLong
{
    int x;
    constexpr MLong() : x{} {}
    constexpr MLong(int x) : x{norm(x % getMod())} {}

    static int Mod;
    constexpr static int getMod()
    {
        if (P > 0)
        {
            return P;
        }
        else
        {
            return Mod;
        }
    }
    constexpr static void setMod(int Mod_)
    {
        Mod = Mod_;
    }
    constexpr int norm(int x) const
    {
        if (x < 0)
        {
            x += getMod();
        }
        if (x >= getMod())
        {
            x -= getMod();
        }
        return x;
    }
    constexpr int val() const
    {
        return x;
    }
    explicit constexpr operator int() const
    {
        return x;
    }
    constexpr MLong operator-() const
    {
        MLong res;
        res.x = norm(getMod() - x);
        return res;
    }
    constexpr MLong inv() const
    {
        assert(x != 0);
        return power(*this, getMod() - 2);
    }
    constexpr MLong &operator*=(MLong rhs) &
    {
        x = mul(x, rhs.x, getMod());
        return *this;
    }
    constexpr MLong &operator+=(MLong rhs) &
    {
        x = norm(x + rhs.x);
        return *this;
    }
    constexpr MLong &operator-=(MLong rhs) &
    {
        x = norm(x - rhs.x);
        return *this;
    }
    constexpr MLong &operator/=(MLong rhs) &
    {
        return *this *= rhs.inv();
    }
    friend constexpr MLong operator*(MLong lhs, MLong rhs)
    {
        MLong res = lhs;
        res *= rhs;
        return res;
    }
    friend constexpr MLong operator+(MLong lhs, MLong rhs)
    {
        MLong res = lhs;
        res += rhs;
        return res;
    }
    friend constexpr MLong operator-(MLong lhs, MLong rhs)
    {
        MLong res = lhs;
        res -= rhs;
        return res;
    }
    friend constexpr MLong operator/(MLong lhs, MLong rhs)
    {
        MLong res = lhs;
        res /= rhs;
        return res;
    }
    friend constexpr std::istream &operator>>(std::istream &is, MLong &a)
    {
        int v;
        is >> v;
        a = MLong(v);
        return is;
    }
    friend constexpr std::ostream &operator<<(std::ostream &os, const MLong &a)
    {
        return os << a.val();
    }
    friend constexpr bool operator==(MLong lhs, MLong rhs)
    {
        return lhs.val() == rhs.val();
    }
    friend constexpr bool operator!=(MLong lhs, MLong rhs)
    {
        return lhs.val() != rhs.val();
    }
};

template <>
int MLong<0LL>::Mod = (1E18) + 9;

template <int P>
struct MInt
{
    int x;
    constexpr MInt() : x{} {}
    constexpr MInt(int x) : x{norm(x % getMod())} {}

    static int Mod;
    constexpr static int getMod()
    {
        if (P > 0)
        {
            return P;
        }
        else
        {
            return Mod;
        }
    }
    constexpr static void setMod(int Mod_)
    {
        Mod = Mod_;
    }
    constexpr int norm(int x) const
    {
        if (x < 0)
        {
            x += getMod();
        }
        if (x >= getMod())
        {
            x -= getMod();
        }
        return x;
    }
    constexpr int val() const
    {
        return x;
    }
    explicit constexpr operator int() const
    {
        return x;
    }
    constexpr MInt operator-() const
    {
        MInt res;
        res.x = norm(getMod() - x);
        return res;
    }
    constexpr MInt inv() const
    {
        assert(x != 0);
        return power(*this, getMod() - 2);
    }
    constexpr MInt &operator*=(MInt rhs) &
    {
        x = 1LL * x * rhs.x % getMod();
        return *this;
    }
    constexpr MInt &operator+=(MInt rhs) &
    {
        x = norm(x + rhs.x);
        return *this;
    }
    constexpr MInt &operator-=(MInt rhs) &
    {
        x = norm(x - rhs.x);
        return *this;
    }
    constexpr MInt &operator/=(MInt rhs) &
    {
        return *this *= rhs.inv();
    }
    friend constexpr MInt operator*(MInt lhs, MInt rhs)
    {
        MInt res = lhs;
        res *= rhs;
        return res;
    }
    friend constexpr MInt operator+(MInt lhs, MInt rhs)
    {
        MInt res = lhs;
        res += rhs;
        return res;
    }
    friend constexpr MInt operator-(MInt lhs, MInt rhs)
    {
        MInt res = lhs;
        res -= rhs;
        return res;
    }
    friend constexpr MInt operator/(MInt lhs, MInt rhs)
    {
        MInt res = lhs;
        res /= rhs;
        return res;
    }
    friend constexpr std::istream &operator>>(std::istream &is, MInt &a)
    {
        int v;
        is >> v;
        a = MInt(v);
        return is;
    }
    friend constexpr std::ostream &operator<<(std::ostream &os, const MInt &a)
    {
        return os << a.val();
    }
    friend constexpr bool operator==(MInt lhs, MInt rhs)
    {
        return lhs.val() == rhs.val();
    }
    friend constexpr bool operator!=(MInt lhs, MInt rhs)
    {
        return lhs.val() != rhs.val();
    }
};

struct custom_bitset
{
    vector<uint64_t> bits;
    int64_t b, n;

    custom_bitset(int64_t _b = 0)
    {
        init(_b);
    }

    void init(int64_t _b)
    {
        b = _b;
        n = (b + 63) / 64;
        bits.assign(n, 0);
    }

    void clear()
    {
        b = n = 0;
        bits.clear();
    }

    void reset()
    {
        bits.assign(n, 0);
    }

    void _clean()
    {
        // Reset all bits after `b`.
        if (b != 64 * n)
            bits.back() &= (1LLU << (b - 64 * (n - 1))) - 1;
    }

    bool get(int64_t index) const
    {
        return bits[index / 64] >> (index % 64) & 1;
    }

    void set(int64_t index, bool value)
    {
        assert(0 <= index && index < b);
        bits[index / 64] &= ~(1LLU << (index % 64));
        bits[index / 64] |= uint64_t(value) << (index % 64);
    }

    // Simulates `bs |= bs << shift;`
    void or_shift(int64_t shift)
    {
        int64_t div = shift / 64, mod = shift % 64;

        if (mod == 0)
        {
            for (int64_t i = n - 1; i >= div; i--)
                bits[i] |= bits[i - div];

            return;
        }

        for (int64_t i = n - 1; i >= div + 1; i--)
            bits[i] |= bits[i - (div + 1)] >> (64 - mod) | bits[i - div] << mod;

        if (div < n)
            bits[div] |= bits[0] << mod;

        _clean();
    }

    // Simulates `bs |= bs >> shift;`
    void or_shift_down(int64_t shift)
    {
        int64_t div = shift / 64, mod = shift % 64;

        if (mod == 0)
        {
            for (int64_t i = div; i < n; i++)
                bits[i - div] |= bits[i];

            return;
        }

        for (int64_t i = 0; i < n - (div + 1); i++)
            bits[i] |= bits[i + (div + 1)] << (64 - mod) | bits[i + div] >> mod;

        if (div < n)
            bits[n - div - 1] |= bits[n - 1] >> mod;

        _clean();
    }

    int64_t find_first() const
    {
        for (int i = 0; i < n; i++)
            if (bits[i] != 0)
                return 64 * i + __builtin_ctzll(bits[i]);

        return -1;
    }

    custom_bitset &operator&=(const custom_bitset &other)
    {
        assert(b == other.b);

        for (int i = 0; i < n; i++)
            bits[i] &= other.bits[i];

        return *this;
    }
};

struct Factorizer
{

    vector<int> min_prime;
    vector<int> primes;
    int prec_n;
    int sp_bound;

    Factorizer(int prec_n = 100,
               int sp_bound = 100,
               int64_t rng_seed = -1) : prec_n(max(prec_n, 3ll)),
                                        sp_bound(sp_bound),
                                        rng(rng_seed != -1 ? rng_seed : chrono::steady_clock::now().time_since_epoch().count())
    {
        min_prime.assign(prec_n + 1, -1);
        for (int i = 2; i <= prec_n; ++i)
        {
            if (min_prime[i] == -1)
            {
                min_prime[i] = i;
                primes.push_back(i);
            }
            int k = min_prime[i];
            for (int j : primes)
            {
                if (j * i > prec_n)
                    break;
                min_prime[i * j] = j;
                if (j == k)
                    break;
            }
        }
    }

    bool is_prime(int64_t n, bool check_small = true)
    {
        if (n <= prec_n)
            return min_prime[n] == n;

        if (check_small)
        {
            for (int p : primes)
            {
                if (p > sp_bound || (int64_t)p * p > n)
                    break;
                if (n % p == 0)
                    return false;
            }
        }

        int s = 0;
        int64_t d = n - 1;
        while (d % 2 == 0)
        {
            ++s;
            d >>= 1;
        }
        for (int64_t a : {2, 325, 9375, 28178, 450775, 9780504, 1795265022})
        {
            if (a >= n)
                break;
            int64_t x = mpow_long(a, d, n);
            if (x == 1 || x == n - 1)
                continue;
            bool composite = true;
            for (int i = 0; i < s - 1; ++i)
            {
                x = mul_mod(x, x, n);
                if (x == 1)
                    return false;
                if (x == n - 1)
                {
                    composite = false;
                    break;
                }
            }
            if (composite)
                return false;
        }
        return true;
    }

    vector<pair<int64_t, int>> factorize(int64_t n, bool check_small = true)
    {
        vector<pair<int64_t, int>> res;
        if (check_small)
        {
            for (int p : primes)
            {
                if (p > sp_bound)
                    break;
                if ((int64_t)p * p > n)
                    break;
                if (n % p == 0)
                {
                    res.emplace_back(p, 0);
                    while (n % p == 0)
                    {
                        n /= p;
                        res.back().second++;
                    }
                }
            }
        }

        if (n == 1)
            return res;
        if (is_prime(n, false))
        {
            res.emplace_back(n, 1);
            return res;
        }

        if (n <= prec_n)
        {
            while (n != 1)
            {
                int d = min_prime[n];
                if (res.empty() || res.back().first != d)
                    res.emplace_back(d, 0);
                res.back().second++;
                n /= d;
            }
            return res;
        }

        int64_t d = get_divisor(n);
        auto a = factorize(d, false);
        for (auto &[div, cnt] : a)
        {
            cnt = 0;
            while (n % div == 0)
            {
                n /= div;
                ++cnt;
            }
        }
        auto b = factorize(n, false);

        int ia = 0, ib = 0;
        while (ia < (int)a.size() || ib < (int)b.size())
        {
            bool choosea;
            if (ia == a.size())
                choosea = false;
            else if (ib == b.size())
                choosea = true;
            else if (a[ia].first <= b[ib].first)
                choosea = true;
            else
                choosea = false;

            res.push_back(choosea ? a[ia++] : b[ib++]);
        }
        return res;
    }

private:
    mt19937_64 rng;
    int64_t rnd(int64_t l, int64_t r)
    {
        return uniform_int_distribution<int64_t>(l, r)(rng);
    }

    int64_t mpow_long(int64_t a, int64_t p, int64_t mod)
    {
        int64_t res = 1;
        while (p)
        {
            if (p & 1)
                res = mul_mod(res, a, mod);
            p >>= 1;
            a = mul_mod(a, a, mod);
        }
        return res;
    }

    int64_t mul_mod(int64_t a, int64_t b, int64_t mod)
    {
        int64_t res = a * b - mod * (int64_t)((long double)1 / mod * a * b);
        if (res < 0)
            res += mod;
        if (res >= mod)
            res -= mod;
        return res;
    }

    int64_t get_divisor(int64_t n)
    {
        auto f = [&](int64_t x) -> int64_t
        {
            int64_t res = mul_mod(x, x, n) + 1;
            if (res == n)
                res = 0;
            return res;
        };

        while (true)
        {
            int64_t x = rnd(1, n - 1);
            int64_t y = f(x);
            while (x != y)
            {
                int64_t d = gcd(n, abs(x - y));
                if (d == 0)
                    break;
                else if (d != 1)
                    return d;
                x = f(x);
                y = f(f(y));
            }
        }
    }
};

void setIO(string s)
{
    freopen((s + ".in").c_str(), "r", stdin);
    freopen((s + ".out").c_str(), "w", stdout);
}

int modpower(int x, int n, int m)
{
    if (n == 0)
        return 1 % m;
    int u = modpower(x, n / 2, m);
    u = (u * u) % m;
    if (n % 2 == 1)
        u = (u * x) % m;
    return u;
}
int power(int x, int n)
{
    if (n == 0)
        return 1;
    int u = power(x, n / 2);
    u = (u * u);
    if (n % 2 == 1)
        u = (u * x);
    return u;
}
int modinverse(int i, int MOD)
{
    if (i == 1)
        return 1;
    return (MOD - ((MOD / i) * modinverse(MOD % i, MOD)) % MOD + MOD) % MOD;
}

int lcm(int x1, int x2)
{
    return ((x1 * x2) / __gcd(x1, x2));
}
bool isPowerOf2(int x)
{
    return x > 0 && (x & (x - 1)) == 0;
}

void printVector(vector<int> &array, int startIndex = 0)
{
    int sz = array.size();
    if (sz == 0)
        return;
    sz += startIndex;
    for (int i = startIndex; i < sz - 1; i++)
    {
        cout << array[i] << " ";
    }
    cout << array[sz - 1] << endl;
}
void printArray(int array[], int sz, int startIndex = 0)
{
    sz += startIndex;
    for (int i = startIndex; i < sz - 1; i++)
    {
        cout << array[i] << " ";
    }
    cout << array[sz - 1] << "\n";
}

template <typename T, typename T_iterable>
vector<pair<T, int>> run_length_encoding(const T_iterable &items)
{
    vector<pair<T, int>> runs;
    T previous;
    int count = 0;

    for (const T &item : items)
        if (item == previous)
        {
            count++;
        }
        else
        {
            if (count > 0)
                runs.emplace_back(previous, count);

            previous = item;
            count = 1;
        }

    if (count > 0)
        runs.emplace_back(previous, count);

    return runs;
}

struct BIT
{
    int size;
    vector<int> bit;
    BIT(int n) : size(n + 4), bit(n + 10) {}
    void update(int x, int v)
    {
        for (; x <= size; x += x & (-x))
            bit[x] += v;
    }
    int query(int b)
    {
        int res = 0;
        for (; b > 0; b -= b & (-b))
            res += bit[b];
        return res;
    }
    int query(int l, int r)
    {
        return query(r) - query(l - 1);
    }
};

struct DSU
{

    int n;
    vector<int> parent, size;

    void init(int rn)
    {
        n = rn + 5;
        parent = vector<int>(n);
        size = vector<int>(n);
        for (int i = 0; i < n; i++)
            make_set(i);
    }

    void make_set(int v)
    {
        parent[v] = v;
        size[v] = 1;
    }

    int find_set(int v)
    {
        if (v == parent[v])
            return v;
        return parent[v] = find_set(parent[v]);
    }

    void union_sets(int a, int b)
    {
        a = find_set(a);
        b = find_set(b);
        if (a != b)
        {
            if (size[a] < size[b])
                swap(a, b);
            parent[b] = a;
            size[a] += size[b];
        }
    }

    int getSize(int v)
    {
        return size[find_set(v)];
    }

    void merge(int a, int b)
    {
        union_sets(a, b);
    }

    int getParrent(int n) { return find_set(n); }
};

int rand(int low, int high)
{
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<int> distribution(low, high);
    return distribution(gen);
}

int sumton(int x)
{
    double n = (-1 + sqrt(1 + 8 * x)) / 2;
    int nn = n;
    if ((n - nn) > 1e-6)
        return -1;
    else
        return nn;
}

int rangesum(int l, int r)
{
    return (r - l + 1) * (r + l) / 2;
}

//////////////////////////////////////----main-function----///////////////////////////////////////////
//====================================================================================================
//====================================================================================================

const int N = 1e6 + 5;
const int K = 1e6 + 5;
const int magic = 333;

using mint = MInt<mod>;

// FUV
string s, s1, s2, s3, s4, s5, s6, s7;

// My Defination
char ch, ch1, ch2;
int n, m, b, a, c, d, e, f, l, r, g, t, x, y, z, p, q, k, u, v, i, j, w, h;
const bool ILOSTNOTHING = true;

int childs[N];
vector<int> vals;
vector<int> adj[N];

void dfs(int node, int parr)
{
    for (int child : adj[node])
        if (child != parr)
        {
            dfs(child, node);
            childs[node] += childs[child];
            vals.push_back((childs[child] * (n - childs[child])) % mod);
        }
    childs[node]++;
}
void pre_process()
{
}
void solve_the_problem(int test_case)
{
    /*
        Please check the value of N :(
        Please read the problem again before coding !
    */

    cin >> n;

    vals.clear();
    for (int i = 0; i <= n; i++)
        adj[i].clear();

    for (int i = 1; i < n; i++)
    {
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    dfs(1, 0);

    cin >> m;
    vector<int> weight(m);
    for (int &i : weight)
        cin >> i;
    for (int &i : vals)
        i %= mod;

    sort(vals.begin(), vals.end());
    sort(weight.begin(), weight.end());

    mint ans = 0;

    mint prev = 1;
    while (weight.size() >= n - 1)
    {
        prev *= weight.back();
        weight.pop_back();
    }

    weight.push_back(prev.val());

    while (weight.size() < n - 1)
        weight.push_back(1);
    while (weight.size() > n - 1)
        weight.pop_back();

    print(vals);
    print(weight);
    sort(vals.begin(), vals.end());
    sort(weight.begin(), weight.end());
    while (vals.size())
    {
        ans += (vals.back() * weight.back()) % mod;
        vals.pop_back();
        weight.pop_back();
        /* code */
    }
    cout << ans << endl;
}

bool endmemory;
signed main()
{

#ifdef ONPC
    const rlim_t stackSize = 1024 * 1024 * 1024; // 1 GB
    struct rlimit rl;
    rl.rlim_cur = stackSize;
    rl.rlim_max = stackSize;
#endif

    ios_base::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);
    cout << fixed << setprecision(5);

#ifdef ONPC

    char name[] = "input.txt";

    freopen(name, "r", stdin);
    freopen("output.txt", "w", stdout);

#endif

    pre_process();
    cin >> test_cases;
    for (int test_case = 1; test_case <= test_cases; test_case++)
    {
        // cout << "Case " << test_case << ": ";
        // cout << "Case " << test_case << ":\n";
        // cout << "Case #" << test_case << ": ";
        solve_the_problem(test_case);
#ifdef ONPC
        // cout << "================================================================" << endln;
#endif
    }

#ifdef ONPC
    if (setrlimit(RLIMIT_STACK, &rl) != 0)
        std::cerr << "Error setting stack size: " << strerror(errno) << std::endl;
    cout << "Stack size: " << stackSize / 1024 / 1024 / 1024 << "GB \n";
    cout << "Execution Time : " << 1.0 * clock() / CLOCKS_PER_SEC << "s\n";
    cout << "Execution Memory : " << (&endmemory - &startmemory) / (1024 * 1024) << "MB\n";

#endif

    return 0;
}